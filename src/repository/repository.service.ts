import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { v4 as uuid4 } from 'uuid';
import { Repository } from './interface/repository.interface';

@Injectable()
export class RepositoryService<T = Repository> {
  constructor(
    @Inject('Redis') private readonly redis: Redis,
    private readonly modelName: string,
  ) {}

  async findById(id: string): Promise<T> {
    const result = await this.redis.get(`${this.modelName}:${id}`);

    if (!result) return null;

    const item = JSON.parse(result);

    return { ...item, id } as T;
  }

  async create(data: Omit<T, 'id'>): Promise<T> {
    const id = uuid4();

    await this.redis.set(`${this.modelName}:${id}`, JSON.stringify(data));
    return { ...data, id } as T;
  }

  async update(id: string, data: Omit<T, 'id'>): Promise<T> {
    const hasItem = await this.redis.exists(`${this.modelName}:${id}`);

    if (!hasItem) {
      return null;
    }

    await this.redis.set(`${this.modelName}:${id}`, JSON.stringify(data));

    return { ...data, id } as T;
  }
}
