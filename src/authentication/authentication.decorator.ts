import {
  ExecutionContext,
  SetMetadata,
  createParamDecorator,
} from '@nestjs/common';

export const RequestKeys = {
  USER: 'user',
  ROLES: 'roles',
};

export const MetadataKeys = {
  ALLOWED_ROLES: 'AllowedRoles',
  PUBLIC: 'AllowPublic',
};

export const AppRoles = {
  HIRER: 'hirer',
  RECRUITER: 'recruiter',
  PRODUCT: 'product',
};

export const AllowedRoles = (...args: string[]) =>
  SetMetadata(MetadataKeys.ALLOWED_ROLES, args);
export const AllowPublic = () => SetMetadata(MetadataKeys.PUBLIC, true);

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request[RequestKeys.USER] as string | undefined;
  },
);

export const Roles = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request[RequestKeys.ROLES] as string[] | undefined;
  },
);
