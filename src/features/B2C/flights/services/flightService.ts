import { Request } from "express";
import db from "../../../../config/db";
import AbstractServices from "../../../../utils/abstracts/abstract.services";
import { flightModel } from "../flight.models";
import { FormatFlightSearch } from "../utils/flight.utils";

export class FlightService extends AbstractServices {
  private models = new flightModel(db);
  constructor() {
    super();
  }

  async flightSearch(req: Request) {
    const reqBody = req.body;

    const cacheKey = `flight_search`;

    const cachedData = this.cache.get(cacheKey);

    if (cachedData) {
      return {
        success: true,
        message: "Flight search from cached",
        ...cachedData,
      };
    }

    const flightsResponse = await this.Req.postRequest(reqBody);

    const formatedData = FormatFlightSearch(flightsResponse?.Data);

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
