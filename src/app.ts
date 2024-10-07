import bodyParser from "body-parser";
import express from "express";
import { errorHandler } from "./middleware/errorHandler";
import { registerRoutes } from "./routes/routes";
import requestLogger from "./utils/logger/reqLogger";

export const app = express();

// Middleware
app.use(bodyParser.json());
app.use(errorHandler);
app.use(requestLogger);

// Routes
registerRoutes(app);
