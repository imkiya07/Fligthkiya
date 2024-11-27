import { NextFunction, Request, Response } from "express";
import { Result, ValidationError, validationResult } from "express-validator";
import fs from "fs";
import path from "path";

type Func = (req: Request, res: Response, next: NextFunction) => Promise<any>;

// Helper function to log errors to the log file
const logErrorToFile = (error: any) => {
  const logDirectory = path.join(process.cwd(), "logs"); // logs directory in the root folder
  const logFile = path.join(logDirectory, "error.log");

  // Ensure the logs directory exists
  if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory, { recursive: true });
  }

  // Prepare the log message
  const logMessage = `[${new Date().toISOString()}] ${
    error.message || "An unexpected error occurred"
  }\n${error.stack || ""}\n\n`;

  // Append the error message to the error.log file
  fs.appendFileSync(logFile, logMessage, { encoding: "utf-8" });
};

// ASYNC WRAPPER
export const wrapAsync = (fn: Func) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);

      /**
       * throw error if there are any invalid inputs
       */
      if (!errors.isEmpty()) {
        throw new ValidationErr(errors);
      }
      await fn(req, res, next);
    } catch (error: any) {
      logErrorToFile(error);

      console.log(error);

      const statusCode = error.statusCode || 500;
      const message = error.message || "An unexpected error occurred";
      console.error(message);
      // console.log({ error });

      res.status(statusCode).json({
        success: false,
        error: {
          statusCode,
          message,
          ...(process.env.NODE_ENV === "development" && {
            stack: error.stack,
          }),
        },
      });
    }
  };
};

interface IError {
  status: number;
  type: string;
}

class ValidationErr extends Error implements IError {
  status: number;
  type: string;

  constructor(error: Result<ValidationError>) {
    super(error.array()[0].msg);
    (this.status = 400),
      (this.type = `Invalid input type for '${error.array()[0].type}'`);
  }
}
