import { Request } from "express";
import AbstractServices from "../../../../core/abstract/abstract.services";
import db from "../../../../core/database/db";
import { IFlightCache } from "../interfaces/preBooking.interface";
import { PreBookingModels } from "../models/preBooking.models";
import { formatRevalidation } from "../utils/preBooking.utils";

export class Revalidation extends AbstractServices {
  constructor() {
    super();
  }

  // FLIGHT SEARCH
  async revalidated(req: Request) {
    const conn = new PreBookingModels(db);

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
      Target: process.env.API_TARGET,
      ConversationId: "MY_SECRET",
    };


    const response = await this.Req.request(
      "POST",
      "/v1/Revalidate/Flight",
      reqBody
    );


    // API RESPONSE ERROR
    if (!response?.Success) {
      this.throwError(response?.Message, 400);
    }

    const formatedData = (await formatRevalidation(
      response?.Data,
      conn
    )) as any;

    this.cache.set(`revalidation-${sessionId}`, formatedData);

    const { FareSourceCode, ...data } = formatedData;

    return {
      success: true,
      message: "Flight revalidation",
      data,
    };
  }
}
