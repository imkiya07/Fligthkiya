import db from "../../config/db";
import { CommonModel } from "./publicModel";

export class CommonService {
  private models: CommonModel;
  constructor() {
    this.models = new CommonModel(db);
  }

  async getAllAirports() {
    // return { success: true, message: "All flights", data: [] };
    return await this.models.getAllAirports();
  }
}
