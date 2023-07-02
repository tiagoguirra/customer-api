import { DynamicModule, Module } from '@nestjs/common';
import { Redis } from 'ioredis';
import { RepositoryService } from './repository.service';
import { camelCase, upperFirst } from 'lodash';

@Module({})
export class RepositoryModule {
  static register(...models: string[]): DynamicModule {
    // Create a repository provider for each model with key prefix
    const modelPproviders = models.map((modelName) => {
      const repositoryName = upperFirst(camelCase(`${modelName}Repository`));
      return {
        provide: repositoryName,
        inject: ['Redis'],
        useFactory: (redis: Redis) => new RepositoryService(redis, modelName),
      };
    });
    return {
      module: RepositoryModule,
      providers: [
        {
          provide: 'Redis',
          useFactory: () =>
            new Redis({
              port: Number(process.env.REDIS_PORT) || 6379,
              host: process.env.REDIS_HOST || '127.0.0.1',
              username: process.env.REDIS_USER || 'default',
              password: process.env.REDIS_PASS || 'default',
              db: 0,
            }),
        },
        ...modelPproviders,
      ],
      exports: modelPproviders,
    };
  }
}
