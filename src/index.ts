import dotenv from "dotenv";
import crypto from "crypto";
import { NextFunction, Request, Response } from "express";
import { app } from "./app";
import { errorHandler } from "./middlewares/errorHandler";
import { registerRoutes } from "./routes/routes";
import requestLogger from "./core/utils/logger/reqLogger";
import cookieParser from "cookie-parser";

// Load environment variables from .env file
dotenv.config();

// Set the port from the environment or fallback to config
const PORT = process.env.PORT || 4001;

app.use(errorHandler);
app.use(requestLogger);
app.use(cookieParser());

app.use((req, res, next) => {
  const userAgent = req.get("User-Agent") || "";
  const acceptLanguage = req.get("Accept-Language") || "";
  const acceptEncoding = req.get("Accept-Encoding") || "";

  const fingerprintString = `${userAgent}-${acceptLanguage}-${acceptEncoding}`;
  const uniqueIdentifier = crypto
    .createHash("sha256")
    .update(fingerprintString)
    .digest("hex");

  req.deviceId = uniqueIdentifier;

  next();
});

// Register application routes
registerRoutes(app);

// Main route
app.get("/", (req: Request, res: Response) => {
  const deviceId = req.deviceId;

  res.send(`Flight server is running... ${deviceId}`);
});

// Route not found (404) handler
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
  });
});

// General error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack); // Log the error for debugging purposes
  res.status(500).json({
    status: "error",
    message: "Internal Server Error",
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
