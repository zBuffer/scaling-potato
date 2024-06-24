import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from './authentication.guard';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AppRoles, MetadataKeys } from './authentication.decorator';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';

describe('AuthenticationGuard', () => {
  let authGuard: AuthGuard;
  let jwtService: JwtService;
  let reflector: Reflector;
  let context: ExecutionContext;
  let httpArgumentHost: HttpArgumentsHost;

  beforeEach(() => {
    jwtService = {} as JwtService;
    reflector = {} as Reflector;
    httpArgumentHost = {} as HttpArgumentsHost;
    context = {
      switchToHttp: jest.fn().mockReturnValue(httpArgumentHost),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as any as ExecutionContext;
    httpArgumentHost.getRequest = jest.fn().mockReturnValue({
      headers: {},
    });
    authGuard = new AuthGuard(jwtService, reflector);
  });

  it('should return true if token is provided', async () => {
    const isPublic = false;
    reflector.getAllAndOverride = jest.fn().mockReturnValue(isPublic);

    httpArgumentHost.getRequest = createAuthorizedGetRequest();
    jwtService.verifyAsync = jest.fn().mockResolvedValue({
      sub: 'user',
    });

    await expect(authGuard.canActivate(context)).resolves.toEqual(true);
  });

  it('should throw UnauthorizedException if no token is provided', async () => {
    const isPublic = false;
    reflector.getAllAndOverride = jest.fn().mockReturnValue(isPublic);

    await expect(authGuard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should return true if it is public and no token is provided', async () => {
    const isPublic = true;
    reflector.getAllAndOverride = jest.fn().mockReturnValue(isPublic);

    await expect(authGuard.canActivate(context)).resolves.toEqual(true);
  });

  it('should return false if role is not in allowed roles', async () => {
    reflector.getAllAndOverride = jest.fn((metadataKey) => {
      if (metadataKey == MetadataKeys.PUBLIC) return false;
      return [AppRoles.HIRER];
    });

    httpArgumentHost.getRequest = createAuthorizedGetRequest();
    jwtService.verifyAsync = jest.fn().mockResolvedValue({
      sub: 'user',
      roles: [AppRoles.PRODUCT, AppRoles.RECRUITER],
    });

    await expect(authGuard.canActivate(context)).resolves.toEqual(false);
  });

  it('should return true if role is not in allowed roles', async () => {
    reflector.getAllAndOverride = jest.fn((metadataKey) => {
      if (metadataKey == MetadataKeys.PUBLIC) return false;
      return [AppRoles.HIRER];
    });

    httpArgumentHost.getRequest = createAuthorizedGetRequest();
    jwtService.verifyAsync = jest.fn().mockResolvedValue({
      sub: 'user',
      roles: [AppRoles.PRODUCT, AppRoles.HIRER],
    });

    await expect(authGuard.canActivate(context)).resolves.toEqual(true);
  });

  const createAuthorizedGetRequest = () =>
    jest.fn().mockReturnValue({
      headers: {
        authorization: 'Bearer xxx',
      },
    });
});
