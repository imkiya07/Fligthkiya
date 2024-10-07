import { NextFunction, Request, Response } from "express";

export const wrapAsync = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next); // Make sure to pass next
    } catch (error: any) {
      console.log({ error });
      const statusCode = error.statusCode || 500;
      const message = error.message || "An unexpected error occurred";

      res.status(statusCode).json({
        error: {
          message,
          ...(process.env.NODE_ENV === "development" && {
            stack: error.stack,
          }),
        },
      });
    }
  };
};
