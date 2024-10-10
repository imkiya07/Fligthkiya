import { Request } from "express";
import db from "../../../../config/db";
import AbstractServices from "../../../../utils/abstracts/abstract.services";
import { fSearchParams } from "../flight.interface";
import { flightModel } from "../flight.models";
import {
  filterByCarrierCode,
  filterByFlightNumber,
  filterByStops,
  FormatFlightSearch,
} from "../utils/flight.utils";

export class FlightService extends AbstractServices {
  private models = new flightModel(db);
  constructor() {
    super();
  }

  // FLIGHT SEARCH
  async flightSearch(req: Request) {
    const conn = new flightModel(db);
    const reqBody = req.body;

    const cacheKey = `flight_search`;

    const cachedData = this.cache.get<any>(cacheKey);

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
        filter: cachedData?.filter,
        results,
      };
    }

    const flightsResponse = await this.Req.postRequest(reqBody);

    // API RESPONSE ERROR
    if (!flightsResponse?.Success) {
      this.throwError(flightsResponse?.error?.Data, flightsResponse?.status);
    }

    const formatedData = await FormatFlightSearch(flightsResponse?.Data, conn);

    this.cache.set(cacheKey, formatedData);

    return {
      success: true,
      message: "Flight search results",
      ...formatedData,
    };
  }

  async getAllFlights() {
    return { success: true, message: "All flights", data: [] };
    return await this.models.getAllFlights();
  }

  async getFlightById(id: number) {
    return await this.models.getFlightById(id);
  }

  async createFlight(flightData: any) {
    return await this.models.createFlight(flightData);
  }

  async updateFlight(id: any, flightData: number) {
    return await this.models.updateFlight(id, flightData);
  }

  async deleteFlight(id: number) {
    return await this.models.deleteFlight(id);
  }
}
