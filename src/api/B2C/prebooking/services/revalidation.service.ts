import { Request } from "express";
import config from "../../../../core/config/config";
import db from "../../../../core/database/db";
import AbstractServices from "../../../../utils/abstracts/abstract.services";
import { IFlightCache } from "../interfaces/flight.interface";
import { PrebookinModels } from "../models/prebooking.models";
import { formatRevalidatioin } from "../utils/prebooking.utils";

export class Revalidation extends AbstractServices {
  constructor() {
    super();
  }

  // FLIGHT SEARCH
  async revalidated(req: Request) {
    const conn = new PrebookinModels(db);

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

    const response = await this.Req.postRequest(
      "/v1/Revalidate/Flight",
      reqBody
    );

    // API RESPONSE ERROR
    if (!response?.Success) {
      this.throwError(response?.Message, 400);
    }

    const formatedData = (await formatRevalidatioin(
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
