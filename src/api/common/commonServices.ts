import { Request } from "express";
import db from "../../core/database/db";
import { CommonModel } from "./commonModel";
import AbstractServices from "../../core/abstract/abstract.services";

export class CommonService extends AbstractServices {
  private models = new CommonModel(db);
  constructor() {
    super();
  }

  // CREATE MYSTIFLY SESSION
  async createMYSTIFLYSession(req: Request) {
    const reqBody = {
      Password: "Inc@2024",
      AccountNumber: "MCN006141",
      UserName: "Inc_API",
    };

    const response = await this.Req.request("POST", "/CreateSession", reqBody);

    if (!response.Success) {
      this.throwError(response.Message, 400);
    }

    return {
      success: true,
      message: "Session id",
      data: { session_id: response.Data.SessionId },
    };
  }

  // ALL AIRPORTS
  async getAllAirports(req: Request) {
    const size = req.query.size as string;
    const search = req.query.search as string;

    const data = await this.models.getAllAirports(size, search);

    return { success: true, message: "All airports", data };
  }
}
