import { Request } from "express";
import AbstractServices from "../../../../core/abstract/abstract.services";
import db from "../../../../core/database/db";
import {
  fSearchParams,
  IAirTravelersRequest,
} from "../interfaces/preBooking.interface";
import { PreBookingModels } from "../models/preBooking.models";
import {
  filterByCarrierCode,
  filterByStops,
  FormatFlightSearch,
  sortDataByDuration,
  sortDataCheapest,
  sortDataEarliest,
} from "../utils/preBooking.utils";

export class FlightSearchService extends AbstractServices {
  constructor() {
    super();
  }

  async flightSearch(req: Request) {
    const conn = new PreBookingModels(db);
    const deviceId = req.deviceId;

    const cacheKey = JSON.stringify(req.body);
    // FILTER DATA
    if (req.query.filter && req.query.filter === "true") {
      const cachedData = deviceId ? this.cache.get<any>(cacheKey) : null;

      if (cachedData) {
        const { airlines, stops, refundable, fastest, earliest, cheapest } =
          req.query as fSearchParams;

        const bolFastest = fastest === "true";
        const bolEarliest = earliest === "true";
        const bolCheapest = cheapest === "true";

        let results = cachedData?.results;

        results = airlines ? filterByCarrierCode(results, airlines) : results;

        results = stops ? filterByStops(results, stops) : results;

        results = Boolean(bolFastest) ? sortDataByDuration(results) : results;

        results = Boolean(bolEarliest) ? sortDataEarliest(results) : results;

        results = Boolean(bolCheapest) ? sortDataCheapest(results) : results;

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

    const reqBody = req.body as IAirTravelersRequest;
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
      this.throwError(
        flightsResponse?.error?.Data ||
          flightsResponse?.Message ||
          flightsResponse?.Data?.Errors[0]?.Message,
        flightsResponse?.status || 200
      );
    }

    const formattedData = await FormatFlightSearch(flightsResponse?.Data, conn);

    this.cache.set(cacheKey, formattedData);
    this.cache.set(deviceId, formattedData);

    return {
      success: true,
      message: "Flight search results",
      ...formattedData,
    };
  }
}
