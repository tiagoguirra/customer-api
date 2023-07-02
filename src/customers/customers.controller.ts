import {
  Body,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomersService } from './customers.service';
import { Customer } from './interface/customer.interface';
import { AuthenticationGuard } from '../authentication/authentication.guard';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get(':id')
  @UseGuards(AuthenticationGuard)
  async findById(@Param('id') id: string): Promise<Customer> {
    const customer = await this.customersService.findById(id);

    if (!customer) {
      throw new NotFoundException(`Customer #${id} not found`);
    }

    return customer;
  }

  @Post()
  @UseGuards(AuthenticationGuard)
  @HttpCode(201)
  async create(
    @Body() createCustomerDto: CreateCustomerDto,
  ): Promise<Customer> {
    const customer = await this.customersService.create(createCustomerDto);

    return customer;
  }

  @Put(':id')
  @UseGuards(AuthenticationGuard)
  async update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    const customer = await this.customersService.findById(id);

    if (!customer) {
      throw new NotFoundException(`Customer #${id} not found`);
    }

    return this.customersService.update(id, updateCustomerDto);
  }
}
