import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import {
  CustomAPIError,
  NotFoundError,
  InternalServerError,
  BadRequest,
} from '../error/customError';

interface CustomError {
  statusCode: number;
  msg: string;
  code?: string | null;
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): Response<any, Record<string, any>> => {
  let customError: CustomError = {
    statusCode:
      err instanceof CustomAPIError ||
      err instanceof NotFoundError ||
      err instanceof InternalServerError
        ? err.statusCode
        : StatusCodes.INTERNAL_SERVER_ERROR,
    msg:
      err instanceof CustomAPIError ||
      err instanceof NotFoundError ||
      err instanceof InternalServerError
        ? err.message
        : 'Internal Server Error',

    code:
      err instanceof CustomAPIError ||
      err instanceof NotFoundError ||
      err instanceof InternalServerError
        ? err.errorCode
        : null,
  };

  if ((err as any).name === 'ValidationError') {
    const errors = Object.values((err as any).errors).map(
      (error: any) => error.message,
    );
    customError.msg = errors[0];
    customError.statusCode = StatusCodes.BAD_REQUEST;
    customError.code = 'VALIDATION_ERROR';
  }

  if ((err as any).name === 'MongoServerError' && (err as any).code === 11000) {
    customError.msg = `Duplicate value entered for ${Object.keys(
      (err as any).keyValue,
    )} field, please choose another value`;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }
  if ((err as any).name === 'CastError') {
    customError.msg = `No item found with id: ${(err as any).value}`;
    customError.statusCode = StatusCodes.NOT_FOUND;
  }

  return res
    .status(customError.statusCode)
    .json({ message: customError.msg, code: customError.code });
};
