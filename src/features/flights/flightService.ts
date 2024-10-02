import db from "../../config/db";
import { flightModel } from "./flight.models";

export class FlightService {
  private models: flightModel;
  constructor() {
    this.models = new flightModel(db);
  }

  async getAllFlights() {
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
