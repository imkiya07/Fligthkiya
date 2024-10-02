import dotenv from "dotenv";
import { app } from "./app";
import { Request, Response } from "express";

dotenv.config();

const PORT = process.env.PORT || 4001;

app.get("/", (req: Request, res: Response) => {
  res.send("flight kiya server...");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
