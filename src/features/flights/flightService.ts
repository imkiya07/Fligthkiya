import { flightModel } from "./flight.models";

export class FlightService {
  private flightModel;
  constructor(flightModel: flightModel) {
    this.flightModel = flightModel;
  }

  async getAllFlights() {
    return await this.flightModel.getAllFlights();
  }

  async getFlightById(id: number) {
    return await this.flightModel.getFlightById(id);
  }

  async createFlight(flightData: any) {
    return await this.flightModel.createFlight(flightData);
  }

  async updateFlight(id: any, flightData: number) {
    return await this.flightModel.updateFlight(id, flightData);
  }

  async deleteFlight(id: number) {
    return await this.flightModel.deleteFlight(id);
  }
}
