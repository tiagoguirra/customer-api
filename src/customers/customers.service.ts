import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Customer } from './interface/customer.interface';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { RepositoryService } from '../repository/repository.service';

@Injectable()
export class CustomersService {
  constructor(
    @Inject('CustomerRepository')
    private readonly CustomerRepository: RepositoryService<Customer>,
  ) {}

  findById(id: string): Promise<Customer> {
    return this.CustomerRepository.findById(id);
  }

  create(customerDto: CreateCustomerDto): Promise<Customer> {
    return this.CustomerRepository.create(customerDto);
  }

  async update(id: string, customerDto: UpdateCustomerDto): Promise<Customer> {
    const customer = await this.CustomerRepository.findById(id);

    if (customer) {
      const updatedCustomer = { ...customer, ...customerDto };
      return this.CustomerRepository.update(id, updatedCustomer);
    }

    throw new NotFoundException(`Customer #${id} not found`);
  }
}
