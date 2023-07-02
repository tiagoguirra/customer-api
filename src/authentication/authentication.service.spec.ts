import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationService } from './authentication.service';
import axios from 'axios';
import { JwtFactory } from '../__mock__/factory/jwt.factory';
import { faker } from '@faker-js/faker';
import { decode, verify } from 'jsonwebtoken';
import { JwksClient } from 'jwks-rsa';

const mockDecode = decode as jest.MockedFunction<typeof decode>;
const mockVerify = verify as jest.MockedFunction<typeof verify>;
const mockJwksClient = JwksClient as jest.MockedClass<typeof JwksClient>;

jest.mock('jsonwebtoken');

jest.mock('jwks-rsa');
jest.mock('axios');

const mockAxiosGet = axios.get as jest.MockedFunction<typeof axios.get>;

describe('AuthenticationService', () => {
  let service: AuthenticationService;

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.spyOn(axios, 'get').mockResolvedValue({
      jwks_uri: 'https://test.com/.well-known/jwks.json',
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthenticationService],
    }).compile();

    service = module.get<AuthenticationService>(AuthenticationService);
  });

  it('should validate access token', async () => {
    const mockJWT = JwtFactory.build();
    const mockToken = faker.string.alphanumeric(256);
    const mockPublicKey = faker.string.alphanumeric(256);

    mockDecode.mockReturnValue(mockJWT);

    // @ts-expect-error - Mocking private method
    mockJwksClient.mockImplementation(() => ({
      getSigningKey: jest.fn().mockResolvedValue({
        getPublicKey: jest.fn().mockReturnValue(mockPublicKey),
      }),
    }));

    mockVerify.mockReturnValue(mockJWT.payload);

    const result = await service.verify(mockToken);
    expect(result).toStrictEqual(mockJWT.payload);

    expect(mockDecode).toBeCalledTimes(1);
    expect(mockAxiosGet).toBeCalledWith(
      `${mockJWT.payload.iss}/.well-known/openid-configuration`,
    );
    expect(mockVerify).toBeCalledWith(mockToken, mockPublicKey);
  });
});
