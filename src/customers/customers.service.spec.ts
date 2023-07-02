import { Test, TestingModule } from '@nestjs/testing';
import { CustomersService } from './customers.service';
import { RepositoryService } from '../repository/repository.service';
import { CustomerFactory } from '../__mock__/factory/customer.factory';
import { Redis } from 'ioredis';

const redisGetMock = jest.fn();
const redisSetMock = jest.fn();
const redisExistsMock = jest.fn();

describe('CustomersService', () => {
  let customerService: CustomersService;
  let repositoryService: RepositoryService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomersService,
        {
          provide: 'Redis',
          useFactory: () => ({
            get: redisGetMock,
            set: redisSetMock,
            exists: redisExistsMock,
          }),
        },
        {
          provide: `CustomerRepository`,
          inject: ['Redis'],
          useFactory: (redis: Redis) => new RepositoryService(redis, 'client'),
        },
      ],
    }).compile();

    customerService = module.get<CustomersService>(CustomersService);
    repositoryService = module.get<RepositoryService>(`CustomerRepository`);
  });

  it('should return customer by id', async () => {
    expect.assertions(2);
    const mockCustomer = CustomerFactory.build();
    jest
      .spyOn(repositoryService, 'findById')
      .mockResolvedValueOnce(mockCustomer);

    const result = await customerService.findById(mockCustomer.id);

    expect(result).toEqual(mockCustomer);
    expect(repositoryService.findById).toBeCalledWith(mockCustomer.id);
  });

  it('should create customer', async () => {
    expect.assertions(2);
    const mockCustomer = CustomerFactory.build();
    jest.spyOn(repositoryService, 'create').mockResolvedValueOnce(mockCustomer);

    const result = await customerService.create(mockCustomer);

    expect(result).toEqual(mockCustomer);
    expect(repositoryService.create).toBeCalledWith(mockCustomer);
  });

  it('should update customer', async () => {
    expect.assertions(3);
    const mockCustomer = CustomerFactory.build();
    const mockUpdate = CustomerFactory.build({ id: mockCustomer.id });
    jest
      .spyOn(repositoryService, 'findById')
      .mockResolvedValueOnce(mockCustomer);
    jest.spyOn(repositoryService, 'update').mockResolvedValueOnce(mockUpdate);

    const result = await customerService.update(mockCustomer.id, mockUpdate);

    expect(result).toEqual(mockUpdate);
    expect(repositoryService.findById).toBeCalledWith(mockCustomer.id);
    expect(repositoryService.update).toBeCalledWith(
      mockCustomer.id,
      mockUpdate,
    );
  });

  it('should throw NotFoundException when customer not found', async () => {
    expect.assertions(1);

    const mockUpdate = CustomerFactory.build();
    jest.spyOn(repositoryService, 'findById').mockResolvedValueOnce(null);

    await expect(
      customerService.update(mockUpdate.id, mockUpdate),
    ).rejects.toThrow(new Error(`Customer #${mockUpdate.id} not found`));
  });
});
