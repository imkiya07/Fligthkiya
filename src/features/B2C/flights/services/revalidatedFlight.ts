import { Request } from "express";
import db from "../../../../config/db";
import AbstractServices from "../../../../utils/abstracts/abstract.services";
import { flightModel } from "../flight.models";
import { formatRevalidatioin } from "../utils/flight.utils";

export class Revalidated extends AbstractServices {
  private models = new flightModel(db);
  constructor() {
    super();
  }

  // FLIGHT SEARCH
  async revalidated(req: Request) {
    const conn = new flightModel(db);
    const reqBody = req.body;

    const response = await this.Req.postRequest(
      "/v1/Revalidate/Flight",
      reqBody
    );

    // API RESPONSE ERROR
    if (!response?.Success) {
      this.throwError(response?.Message, 400);
    }

    const data = await formatRevalidatioin(response?.Data, conn);

    return {
      success: true,
      message: "Flight search results",
      data,
    };
  }
}
