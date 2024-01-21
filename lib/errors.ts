import { AxiosResponse } from "axios";

export class ApiError extends Error {

  constructor(message: string, public statusCode: number) {
    super(message);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError)
    }

    this.name = 'ApiError';
    
    // this.code = response.code;
  }
}

export type ErrorObject = { [key: string]: string[] };

export class ValidationError extends ApiError {
  public errors: ErrorObject;

  constructor(message: string, status: number, errors: ErrorObject = {}) {
    super(message, status);
    this.errors = errors;
  }
}
