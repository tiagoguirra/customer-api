import { JwtPayloadFactory } from '../__mock__/factory/jwt.factory';
import { AuthenticationService } from './authentication.service';
import { AuthenticationGuard } from './authentication.guard';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthenticationGuard', () => {
  it('should verify token and set user on request', async () => {
    const authService = new AuthenticationService();
    const mockJwtPayload = JwtPayloadFactory.build();

    jest.spyOn(authService, 'verify').mockResolvedValueOnce(mockJwtPayload);
    const mockRequest = {
      headers: {
        authorization: 'Bearer token',
      },
    };
    const mockContext = {
      switchToHttp: jest.fn(() => ({
        getRequest: jest.fn(() => mockRequest),
      })),
    };

    const guard = new AuthenticationGuard(authService);
    const result = await guard.canActivate(mockContext as any);

    expect(result).toBe(true);
    expect(mockRequest['user']).toStrictEqual(mockJwtPayload);
    expect(authService.verify).toBeCalledWith('token');
  });

  it('should throw unauthorized exception if token is not provided', async () => {
    const authService = new AuthenticationService();
    const mockContext = {
      switchToHttp: jest.fn(() => ({
        getRequest: jest.fn(() => ({
          headers: {},
        })),
      })),
    };

    const guard = new AuthenticationGuard(authService);

    await expect(guard.canActivate(mockContext as any)).rejects.toThrow(
      new UnauthorizedException('Missing token'),
    );
  });

  it('should throw unauthorized exception if token is invalid', async () => {
    const authService = new AuthenticationService();

    jest.spyOn(authService, 'verify').mockRejectedValue(new Error());
    const mockRequest = {
      headers: {
        authorization: 'Bearer invalid_token',
      },
    };
    const mockContext = {
      switchToHttp: jest.fn(() => ({
        getRequest: jest.fn(() => mockRequest),
      })),
    };

    const guard = new AuthenticationGuard(authService);
    await expect(guard.canActivate(mockContext as any)).rejects.toThrow(
      new UnauthorizedException('Access denied'),
    );
  });
});
