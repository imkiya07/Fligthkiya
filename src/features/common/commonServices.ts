import { Request } from "express";
import db from "../../config/db";
import { AppError } from "../../utils/errors/AppError";
import { CommonModel } from "./commonModel";

export class CommonService {
  private models= new CommonModel(db);
  constructor() {
  }

  async getAllAirports(req:Request) {
    const size = req.query.size as string;
    const search = req.query.search as string;



    const data = await this.models.getAllAirports(size, search);

    // throw new AppError("Failed to fetch airports", 500);

    return { success: true, message: "All airports", data };
  }
}
