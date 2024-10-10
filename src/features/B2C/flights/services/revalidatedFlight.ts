import { Request } from "express";
import db from "../../../../config/db";
import AbstractServices from "../../../../utils/abstracts/abstract.services";
import { flightModel } from "../flight.models";
import { FormatFlightSearch } from "../utils/flight.utils";

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

    return { success: true, response };

    // API RESPONSE ERROR
    if (!response?.Success) {
      this.throwError(response?.error?.Data, response?.status);
    }

    const formatedData = await FormatFlightSearch(response?.Data, conn);

    return {
      success: true,
      message: "Flight search results",
      ...formatedData,
    };
  }
}
