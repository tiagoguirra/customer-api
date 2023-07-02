import { Test } from '@nestjs/testing';
import { RepositoryModule } from './repository.module';
import { RepositoryService } from './repository.service';

jest.mock('ioredis', () => ({
  Redis: jest.fn(),
}));

jest.mock('./repository.service', () => ({
  RepositoryService: jest.fn(),
}));

const mockRepositoryService = RepositoryService as jest.Mock;

describe('RepositoryModule', () => {
  it('should provide repositories for each model', async () => {
    const module = await Test.createTestingModule({
      imports: [RepositoryModule.register('client', 'product')],
    }).compile();

    expect(module).toBeDefined();
    expect(module.get('ClientRepository')).toBeInstanceOf(RepositoryService);
    expect(module.get('ProductRepository')).toBeInstanceOf(RepositoryService);

    expect(mockRepositoryService).toHaveBeenNthCalledWith(1, {}, 'client');
    expect(mockRepositoryService).toHaveBeenNthCalledWith(2, {}, 'product');
  });
});
