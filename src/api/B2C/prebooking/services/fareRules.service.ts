import { Request } from "express";
import AbstractServices from "../../../../core/abstract/abstract.services";
import { IFlightCache } from "../interfaces/preBooking.interface";

export class FareRules extends AbstractServices {
  constructor() {
    super();
  }

  // FLIGHT SEARCH
  async fareRules(req: Request) {
    const sessionId = req.get("sessionid") as string;

    const cachedData = this.cache.get<IFlightCache>(sessionId);

    const flight_id = req.params.flight_id;

    const revalidationItem = this.cache.get<{ FareSourceCode: string }>(
      `revalidation-${sessionId}`
    );

    if (!revalidationItem) {
      this.throwError("Revalidation is required!", 400);
    }

    const reqBody = {
      FareSourceCode: revalidationItem?.FareSourceCode,
      Target: process.env.API_TARGET,
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
