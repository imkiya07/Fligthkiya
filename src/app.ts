import bodyParser from "body-parser";
import express from "express";
import { flightRoute } from "./features/flights/flightRoutes";

export const app = express();

// Middleware
app.use(bodyParser.json());

// Routes
app.use("/api", flightRoute);
