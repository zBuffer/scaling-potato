import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { MetadataKeys, RequestKeys } from './authentication.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  /**
   * Determines if the user is authorized to access the requested route.
   * @param context - The execution context of the route.
   * @returns A promise that resolves to a boolean indicating whether the user is authorized.
   * @throws {UnauthorizedException} If the user is not authorized.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      MetadataKeys.PUBLIC,
      [context.getHandler(), context.getClass()],
    );
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token =
      this.extractTokenFromHeader(request) ||
      this.extractTokenFromQuery(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token);
      request[RequestKeys.USER] = payload;
    } catch {
      throw new UnauthorizedException();
    }

    const user = request[RequestKeys.USER];
    if (!user.sub) {
      throw new UnauthorizedException();
    }

    const roles: string[] = user.roles;
    request[RequestKeys.ROLES] = roles;

    const allowedRoles = this.reflector.getAllAndOverride<string[]>(
      MetadataKeys.ALLOWED_ROLES,
      [context.getHandler(), context.getClass()],
    );
    if (!allowedRoles) {
      return true;
    }

    if (!roles) {
      return false;
    }

    // Returning false here will lead to Forbidden being thrown
    return allowedRoles.some((role) => roles.includes(role));
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const headers = request.headers as any;
    const [type, token] = headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private extractTokenFromQuery(request: any): string | undefined {
    return request.query?.accessToken;
  }
}
