import { Request } from "express";
import db from "../../../../core/database/db";
import AbstractServices from "../../../../utils/abstracts/abstract.services";
import { fSearchParams } from "../interfaces/flight.interface";
import { PrebookinModels } from "../models/prebooking.models";
import {
  filterByCarrierCode,
  filterByFlightNumber,
  filterByStops,
  FormatFlightSearch,
} from "../utils/prebooking.utils";

export class FlightSearchService extends AbstractServices {
  constructor() {
    super();
  }

  // FLIGHT SEARCH
  async flightSearch(req: Request) {
    const conn = new PrebookinModels(db);
    const cacheKey = req.headers.sessionid as string;

    const cachedData = cacheKey ? this.cache.get<any>(cacheKey) : null;

    if (cachedData) {
      const { airlines, flight_numbers, stops, refundable } =
        req.query as fSearchParams;

      let results = cachedData?.results;

      results = airlines ? filterByCarrierCode(results, airlines) : results;

      results = flight_numbers
        ? filterByFlightNumber(results, flight_numbers)
        : results;

      results = stops ? filterByStops(results, stops) : results;

      return {
        success: true,
        message: "Flight search results from cached",
        count: results?.length,
        results,
        filter: cachedData?.filter,
      };
    }

    const reqBody = req.body;
    const flightsResponse = await this.Req.postRequest("/v2/Search/Flight", {
      ...reqBody,
      ConversationId: "MY_SECRET",
    });

    // API RESPONSE ERROR
    if (!flightsResponse?.Success) {
      this.throwError(flightsResponse?.error?.Data, flightsResponse?.status);
    }

    const formatedData = await FormatFlightSearch(flightsResponse?.Data, conn);
    const sessionId = "49013bca224f1728799949660"; // this.createSession();

    this.cache.set(sessionId, formatedData);

    return {
      success: true,
      message: "Flight search results",
      sessionId,
      ...formatedData,
    };
  }
}