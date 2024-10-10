import knex from "knex";

export class flightModel {
  private db;
  constructor(db: knex.Knex<any, unknown[]>) {
    this.db = db;
  }

  getAllFlights() {
    return this.db("flights").select("*");
  }

  getFlightById(id: number) {
    return this.db("flights").where({ id }).first();
  }

  createFlight(flightData: any) {
    return this.db("flights").insert(flightData);
  }

  updateFlight(id: number, flightData: any) {
    return this.db("flights").where({ id }).update(flightData);
  }

  deleteFlight(id: any) {
    return this.db("flights").where({ id }).del();
  }
}
