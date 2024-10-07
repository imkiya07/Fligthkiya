// errorHandler.ts
import { NextFunction, Request, Response } from "express";
import logger from "../utils/logger/logger";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);
  logger.error(err.message); // Log the error for debugging purposes

  // Set the response status code and message
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    error: {
      message: err.message || "Internal Server Error",
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }), // Optional: Include stack trace in development
    },
  });
};
