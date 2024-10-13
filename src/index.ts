import dotenv from "dotenv";
import { Request, Response } from "express";
import { app } from "./app";
import config from "./core/config/config";

dotenv.config();

const PORT = config.PORT;

app.get("/", (req: Request, res: Response) => {
  res.send("flight kiya server...");
});

// Route not found (404) handler
app.use((req, res, next) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
