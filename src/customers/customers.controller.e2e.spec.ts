import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { CanActivate, INestApplication } from '@nestjs/common';
import { AuthenticationGuard } from '../authentication/authentication.guard';
import { CustomerFactory } from '../__mock__/factory/customer.factory';

jest.mock('./customers.service');

describe('CustomersController', () => {
  let service: CustomersService;
  let app: INestApplication;

  beforeEach(async () => {
    jest.clearAllMocks();
    const mockGuard: CanActivate = {
      canActivate: jest.fn(() => true),
    };

    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [CustomersController],
      providers: [CustomersService],
    })
      .overrideGuard(AuthenticationGuard)
      .useValue(mockGuard)
      .compile();

    app = moduleRef.createNestApplication();
    service = moduleRef.get<CustomersService>(CustomersService);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return customer with status code 200 for /GET customers/:ID', async () => {
    const mockCustomer = CustomerFactory.build();
    jest.spyOn(service, 'findById').mockResolvedValue(mockCustomer);

    return request(app.getHttpServer())
      .get(`/customers/${mockCustomer.id}`)
      .expect(200)
      .expect(mockCustomer);
  });

  it('shoudl return status code 404 for /GET customers/:ID when id not found', async () => {
    const mockCustomer = CustomerFactory.build();
    jest.spyOn(service, 'findById').mockResolvedValue(null);

    return request(app.getHttpServer())
      .get(`/customers/${mockCustomer.id}`)
      .expect(404)
      .expect({
        statusCode: 404,
        message: `Customer #${mockCustomer.id} not found`,
        error: 'Not Found',
      });
  });

  it('should criate and return customer for /POST customers', async () => {
    const mockCustomer = CustomerFactory.build();
    jest.spyOn(service, 'create').mockResolvedValue(mockCustomer);

    return request(app.getHttpServer())
      .post('/customers')
      .send(mockCustomer)
      .expect(201)
      .expect(mockCustomer);
  });

  it('should update and return customer updated for /PUT customers/:id', async () => {
    const mockCustomer = CustomerFactory.build();
    const updatedCustomer = {
      ...mockCustomer,
      name: 'Updated Name',
    };

    jest.spyOn(service, 'update').mockResolvedValue(updatedCustomer);
    jest.spyOn(service, 'findById').mockResolvedValue(mockCustomer);

    return request(app.getHttpServer())
      .put(`/customers/${mockCustomer.id}`)
      .send({
        name: 'Updated Name',
      })
      .expect(200)
      .expect(updatedCustomer);
  });

  it('should return status code 404 for /PUT customers/:id when update customer not found', async () => {
    const mockCustomer = CustomerFactory.build();

    jest.spyOn(service, 'update').mockResolvedValue(null);
    jest.spyOn(service, 'findById').mockResolvedValue(null);

    return request(app.getHttpServer())
      .put(`/customers/${mockCustomer.id}`)
      .send({
        name: 'Updated Name',
      })
      .expect(404)
      .expect({
        statusCode: 404,
        message: `Customer #${mockCustomer.id} not found`,
        error: 'Not Found',
      });
  });
});
