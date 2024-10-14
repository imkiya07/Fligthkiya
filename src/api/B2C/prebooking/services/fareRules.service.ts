import { Request } from "express";
import config from "../../../../core/config/config";
import db from "../../../../core/database/db";
import AbstractServices from "../../../../utils/abstracts/abstract.services";
import { IFlightCache } from "../interfaces/flight.interface";
import { PrebookinModels } from "../models/prebooking.models";

export class FareRules extends AbstractServices {
  private conn = new PrebookinModels(db);
  constructor() {
    super();
  }

  // FLIGHT SEARCH
  async fareRules(req: Request) {
    const sessionId = req.get("sessionid") as string;

    const cachedData = this.cache.get<IFlightCache>(sessionId);

    const flight_id = req.params.flight_id;

    const foundItem = cachedData?.results?.find(
      (item) => item.flight_id === flight_id
    );

    if (!foundItem) {
      this.throwError("Invalid session id or flight id", 400);
    }

    const reqBody = {
      FareSourceCode: foundItem?.fareSourceCode,
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
      message: "Fare rules",
      data: { TraceId, BaggageInfos, FareRules },
    };
  }
}
