import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

// Replace 'your-secret-key' with your actual secret key
const secretKey = "your-secret-key";

// Authentication middleware
export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  console.log({ authHeader });

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res
      .status(401)
      .json({ error: "Authorization header missing or malformed" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
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
