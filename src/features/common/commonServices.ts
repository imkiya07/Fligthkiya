import db from "../../config/db";
import { AppError } from "../../utils/errors/AppError";
import { CommonModel } from "./commonModel";

export class CommonService {
  private models: CommonModel;
  constructor() {
    this.models = new CommonModel(db);
  }

  async getAllAirports() {
    const data = await this.models.getAllAirports();

    // throw new AppError("Failed to fetch airports", 500);

    return { success: true, message: "All airports", data };
  }
}
