import { Request } from "express";
import config from "../../../../core/config/config";
import db from "../../../../core/database/db";
import AbstractServices from "../../../../utils/abstracts/abstract.services";
import { PostbookingModels } from "../models/postbooking.models";

export class FareRules extends AbstractServices {
  private conn = new PostbookingModels(db);
  constructor() {
    super();
  }

  // FLIGHT SEARCH
  async fareRules(req: Request) {
    const { fareSourceCode } = req.query;

    if (!fareSourceCode) {
      this.throwError("Fare source code missing", 400);
    }

    const reqBody = {
      FareSourceCode: fareSourceCode,
      Target: config.API_TARGET,
      ConversationId: "MY_SECRET",
    };

    const response = await this.Req.request(
      "POST",
      "/v1/FlightFareRules",
      reqBody
    );

    // API RESPONSE ERROR
    if (!response?.Success) {
      this.throwError(response?.Message, 400);
    }

    // FORMATTER
    const { BaggageInfos, FareRules, TraceId } = response?.Data;

    return {
      success: true,
      message: "Flight search results",
      data: { TraceId, BaggageInfos, FareRules },
    };
  }
}
