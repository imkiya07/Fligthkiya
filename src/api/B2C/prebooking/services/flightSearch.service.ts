import { Request } from "express";
import AbstractServices from "../../../../core/abstract/abstract.services";
import db from "../../../../core/database/db";
import { fSearchParams } from "../interfaces/preBooking.interface";
import {
  filterByCarrierCode,
  filterByFlightNumber,
  filterByStops,
  FormatFlightSearch,
} from "../utils/preBooking.utils";
import { PreBookingModels } from "../models/preBooking.models";

export class FlightSearchService extends AbstractServices {
  constructor() {
    super();
  }

  async flightSearch(req: Request) {
    const conn = new PreBookingModels(db);

    // FILTER DATA
    if (req.query.filter && req.query.filter === "true") {
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
    }

    // SEARCH DATA

    const reqBody = req.body;
    const flightsResponse = await this.Req.request(
      "POST",
      "/v2/Search/Flight",
      {
        ...reqBody,
        ConversationId: "MY_SECRET",
      }
    );

    // API RESPONSE ERROR
    if (!flightsResponse?.Success) {
      this.throwError(flightsResponse?.error?.Data, flightsResponse?.status);
    }

    const formattedData = await FormatFlightSearch(flightsResponse?.Data, conn);
    const sessionId = "49013bca224f1728799949660"; // this.createSession();

    this.cache.set(sessionId, formattedData);

    return {
      success: true,
      message: "Flight search results",
      sessionId,
      ...formattedData,
    };
  }
}
