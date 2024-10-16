import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import { errorHandler } from "./middlewares/errorHandler";
import { registerRoutes } from "./routes/routes";
import requestLogger from "./utils/logger/reqLogger";
const path = require("path");
const fs = require("fs");

export const app = express();

// Enable CORS for all routes
app.use(cors());

// const corsOptions = {
//   origin: 'http://example.com',
//   credentials: true,
// };

// app.use(cors(corsOptions));

// download logs

app.get("/download-err-log", (req, res) => {
  const filePath = path.resolve(__dirname, "../../logs/error.log");

  fs.access(filePath, fs.constants.F_OK, (err: any) => {
    if (err) {
      console.error("File does not exist:", err);
      return res.status(404).send("Log file not found");
    }

    res.download(filePath, "error.log", (err) => {
      if (err) {
        console.error("Error downloading the file:", err);
        res.status(500).send("Error downloading the file");
      }
    });
  });
});

// Route to clear the content of error.log
app.get("/clear-err-log", (req, res) => {
  const filePath = path.join(__dirname, "../../logs/error.log");

  // Use fs.truncate to empty the file
  fs.truncate(filePath, 0, (err: any) => {
    if (err) {
      console.error("Error clearing the file:", err);
      return res.status(500).send("Error clearing the file");
    }
    res.send("File cleared successfully");
  });
});

app.get("/download-all-log", (req, res) => {
  const filePath = path.resolve(__dirname, "../../logs/all.log");

  fs.access(filePath, fs.constants.F_OK, (err: any) => {
    if (err) {
      console.error("File does not exist:", err);
      return res.status(404).send("Log file not found");
    }

    res.download(filePath, "all.log", (err) => {
      if (err) {
        console.error("Error downloading the file:", err);
        res.status(500).send("Error downloading the file");
      }
    });
  });
});

// Route to clear the content of error.log
app.get("/clear-res-log", (req, res) => {
  const filePath = path.join(__dirname, "../../logs/all.log");

  // Use fs.truncate to empty the file
  fs.truncate(filePath, 0, (err: any) => {
    if (err) {
      console.error("Error clearing the file:", err);
      return res.status(500).send("Error clearing the file");
    }
    res.send("File cleared successfully");
  });
});

// Middleware
app.use(bodyParser.json());
app.use(errorHandler);
app.use(requestLogger);

// Routes
registerRoutes(app);
