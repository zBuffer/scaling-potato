import { BadRequestException, NotFoundException } from '@nestjs/common';

export const throwNotFoundIfFalsey = async <T>(
  promise: Promise<T> | T,
): Promise<T> => {
  const result = await promise;
  if (!result || isEmptyObject(result)) throw new NotFoundException();
  return result;
};

export const throwBadRequestIfFalsey = async <T>(
  promise: Promise<T> | T,
): Promise<T> => {
  const result = await promise;
  if (!result || isEmptyObject(result)) throw new BadRequestException();
  return result;
};

export const isEmptyObject = (obj: any): boolean => {
  return obj && typeof obj === 'object' && !Object.keys(obj).length;
};
