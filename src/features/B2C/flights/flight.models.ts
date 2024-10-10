import knex from "knex";
import NodeCache from "node-cache";

export class flightModel {
  private db;
  private cache = new NodeCache({ stdTTL: 10 * 60, checkperiod: 120 });
  constructor(db: knex.Knex<any, unknown[]>) {
    this.db = db;
  }

  getAirline = async (iata: string) => {
    const cached = this.cache.get(iata);

    if (cached) {
      return cached;
    }

    const data = await this.db("airlines")
      .select("name")
      .where({ iata })
      .first();
    this.cache.set(iata, data?.name);

    return data?.name;
  };

  getAirport = async (iata: string) => {
    const cached = this.cache.get(iata);

    if (cached) {
      return cached;
    }

    const data = await this.db("airports")
      .select("name")
      .where({ iata })
      .first();
    this.cache.set(iata, data?.name);
    return data?.name;
  };

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
