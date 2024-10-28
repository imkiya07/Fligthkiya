export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // Indicate this is a known operational error

    Error.captureStackTrace(this, this.constructor); // Capture the stack trace
  }
}