import dotenv from "dotenv";
import { Request, Response } from "express";
import { app } from "./app";
import config from "./config/config";

dotenv.config();

const PORT = config.PORT;

app.get("/", (req: Request, res: Response) => {
  res.send("flight kiya server...");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
