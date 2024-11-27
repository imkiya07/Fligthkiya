import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

// Authentication middleware
export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res
      .status(401)
      .json({ error: "Authorization header missing or malformed" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const secretKey = process.env.JWT_SECRET as string;
    // Verify the token
    const decoded = jwt.verify(token, secretKey);

    // Attach the decoded payload to the request object (e.g., req.user)
    (req as any).user = decoded;
    req.user_id = req.user.user_id;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}
