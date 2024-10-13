import { Request, Response, NextFunction } from "express";

// Middleware to check for sessionId in the headers
const checkSessionId = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const sessionId = req.get("sessionid");

  if (!sessionId) {
    res.status(400).json({ error: "sessionId header is required" });
    return; // Stop the execution after sending the response
  }

  // If sessionId is present, proceed to the next middleware/route handler
  next();
};

export default checkSessionId;
