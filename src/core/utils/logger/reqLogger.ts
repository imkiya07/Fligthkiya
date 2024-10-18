import { Request, Response, NextFunction } from "express";
import logger from "./logger";

const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const { method, url } = req;
  const timestamp = new Date().toISOString();

  logger.info(`[${timestamp}] ${method} ${url}`);

  // Call the next middleware or route handler
  next();
};

export default requestLogger;
