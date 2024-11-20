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
  filterByFlightNumber,
  filterByStops,
  FormatFlightSearch,
} from "../utils/preBooking.utils";

export class FlightSearchService extends AbstractServices {
  constructor() {
    super();
  }

  async flightSearch(req: Request) {
    const conn = new PreBookingModels(db);
    const deviceId = req.deviceId;

    // FILTER DATA
    if (req.query.filter && req.query.filter === "true") {
      // const cacheKey = req.headers.sessionid as string;

      const cachedData = deviceId ? this.cache.get<any>(deviceId) : null;

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

    this.cache.set(deviceId, formattedData);

    return {
      success: true,
      message: "Flight search results",
      ...formattedData,
    };
  }
}
