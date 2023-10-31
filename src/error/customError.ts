import { StatusCodes } from "http-status-codes";

class CustomAPIError extends Error {
  statusCode: number;
  errorCode?: string | null;

  constructor(message: string, statusCode?: number, errorCode?: string) {
    super(message);
    this.statusCode = statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    this.errorCode = errorCode || null;
  }
}

class BadRequest extends CustomAPIError {
  constructor(message: string) {
    super(message, StatusCodes.BAD_REQUEST, "BAD_REQUEST");
  }
}

class AuthenticationError extends CustomAPIError {
  constructor(message: string) {
    super(message, StatusCodes.UNAUTHORIZED, "AUTHENTICATION_ERROR");
  }
}

class GatewayError extends CustomAPIError {
  constructor(message: string) {
    super(message, StatusCodes.BAD_GATEWAY, "GATEWAY_ERROR");
  }
}

class ValidationError extends CustomAPIError {
  constructor(message: string) {
    super(message, StatusCodes.BAD_REQUEST, "VALIDATION_ERROR");
  }
}

class ForbiddenError extends CustomAPIError {
  constructor(message: string) {
    super(message, StatusCodes.FORBIDDEN, "FORBIDDEN_ERROR");
  }
}

class NotFoundError extends CustomAPIError {
  constructor(message: string) {
    super(message, StatusCodes.NOT_FOUND, "NOT_FOUND_ERROR");
  }
}

class ConflictError extends CustomAPIError {
  constructor(message: string) {
    super(message, StatusCodes.CONFLICT, "CONFLICT_ERROR");
  }
}

class InternalServerError extends CustomAPIError {
  constructor(message: string) {
    super(message, StatusCodes.INTERNAL_SERVER_ERROR, "INTERNAL_SERVER_ERROR");
  }
}

export {
  CustomAPIError,
  BadRequest,
  AuthenticationError,
  GatewayError,
  ValidationError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  InternalServerError
};
