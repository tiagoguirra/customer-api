import { IsNotEmpty } from 'class-validator';
import { Customer } from '../interface/customer.interface';

export class CreateCustomerDto implements Omit<Customer, 'id'> {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  document: string;
}
