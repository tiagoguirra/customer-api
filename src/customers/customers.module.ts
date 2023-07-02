import { Module } from '@nestjs/common';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { RepositoryModule } from 'src/repository/repository.module';
import { AuthenticationModule } from 'src/authentication/authentication.module';

@Module({
  imports: [RepositoryModule.register('customer'), AuthenticationModule],
  controllers: [CustomersController],
  providers: [CustomersService],
})
export class CustomersModule {}
