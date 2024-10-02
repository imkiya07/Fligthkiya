import bodyParser from "body-parser";
import express from "express";
import { registerRoutes } from "./routes/routes";

export const app = express();

// Middleware
app.use(bodyParser.json());

// Routes
registerRoutes(app);
