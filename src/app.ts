import bodyParser from "body-parser";
import cors from "cors";
import express from "express";

export const app = express();

// Enable CORS for all routes
app.use(cors());

// Middleware
app.use(bodyParser.json());
