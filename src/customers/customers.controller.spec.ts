import { Test, TestingModule } from '@nestjs/testing';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { CanActivate, NotFoundException } from '@nestjs/common';
import { AuthenticationGuard } from '../authentication/authentication.guard';
import { CustomerFactory } from '../__mock__/factory/customer.factory';

jest.mock('./customers.service');

describe('CustomersController', () => {
  let controller: CustomersController;
  let service: CustomersService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const mockGuard: CanActivate = {
      canActivate: jest.fn(() => true),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomersController],
      providers: [CustomersService],
    })
      .overrideGuard(AuthenticationGuard)
      .useValue(mockGuard)
      .compile();

    controller = module.get<CustomersController>(CustomersController);
    service = module.get<CustomersService>(CustomersService);
  });

  it('should return customer by id', async () => {
    expect.assertions(1);
    const mockCustomer = CustomerFactory.build();
    jest.spyOn(service, 'findById').mockResolvedValue(mockCustomer);

    const customer = await controller.findById(mockCustomer.id);

    expect(customer).toEqual(mockCustomer);
  });

  it('should create a customer', async () => {
    expect.assertions(1);
    const mockCustomer = CustomerFactory.build();
    jest.spyOn(service, 'create').mockResolvedValue(mockCustomer);

    const customer = await controller.create(mockCustomer);

    expect(customer).toEqual(mockCustomer);
  });

  it('should update a customer', async () => {
    expect.assertions(1);
    const mockCustomer = CustomerFactory.build();
    jest.spyOn(service, 'findById').mockResolvedValue(mockCustomer);
    jest.spyOn(service, 'update').mockResolvedValue(mockCustomer);

    const customer = await controller.update(mockCustomer.id, mockCustomer);

    expect(customer).toEqual(mockCustomer);
  });

  it('should throw an error when customer not found', async () => {
    expect.assertions(1);
    const mockCustomer = CustomerFactory.build();
    jest.spyOn(service, 'findById').mockResolvedValue(null);

    await expect(controller.findById(mockCustomer.id)).rejects.toThrow(
      new NotFoundException(`Customer #${mockCustomer.id} not found`),
    );
  });

  it('should throw an error when customer from update not found', async () => {
    expect.assertions(1);
    const mockCustomer = CustomerFactory.build();
    jest.spyOn(service, 'findById').mockResolvedValue(null);

    await expect(
      controller.update(mockCustomer.id, mockCustomer),
    ).rejects.toThrow(
      new NotFoundException(`Customer #${mockCustomer.id} not found`),
    );
  });
});
