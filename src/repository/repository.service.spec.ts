import { Test, TestingModule } from '@nestjs/testing';
import { RepositoryService } from './repository.service';
import { Redis } from 'ioredis';
import { CustomerFactory } from '../__mock__/factory/customer.factory';

const redisGetMock = jest.fn();
const redisSetMock = jest.fn();
const redisExistsMock = jest.fn();

describe('RepositoryService', () => {
  let repository: RepositoryService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'Redis',
          useFactory: () => ({
            get: redisGetMock,
            set: redisSetMock,
            exists: redisExistsMock,
          }),
        },
        {
          provide: `ClientRepository`,
          inject: ['Redis'],
          useFactory: (redis: Redis) => new RepositoryService(redis, 'client'),
        },
      ],
    }).compile();

    repository = module.get<RepositoryService>('ClientRepository');
  });

  it('should find object with id', async () => {
    expect.assertions(2);

    const mockUser = CustomerFactory.build();
    redisGetMock.mockResolvedValue(JSON.stringify(mockUser));

    const result = await repository.findById(mockUser.id);

    expect(result).toEqual(mockUser);
    expect(redisGetMock).toBeCalledWith(`client:${mockUser.id}`);
  });

  it('should create a new item and store in redis', async () => {
    expect.assertions(2);
    redisSetMock.mockResolvedValue('OK');

    const mockUser = CustomerFactory.build({ id: null });
    const result = await repository.create(mockUser);

    expect(result).toEqual({
      ...mockUser,
      id: expect.any(String),
    });

    expect(redisSetMock).toBeCalledWith(
      expect.stringContaining('client:'),
      JSON.stringify(mockUser),
    );
  });

  it('should update a item and store in redis', async () => {
    expect.assertions(2);
    redisExistsMock.mockResolvedValue(1);
    redisSetMock.mockResolvedValue('OK');

    const mockUser = CustomerFactory.build();
    const result = await repository.update(mockUser.id, mockUser);

    expect(result).toEqual(mockUser);

    expect(redisSetMock).toBeCalledWith(
      `client:${mockUser.id}`,
      JSON.stringify(mockUser),
    );
  });
});
