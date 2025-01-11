import knex from "knex";
import NodeCache from "node-cache";
import { ITravellersBody } from "./travelers.interfaces";

export class AirTravelersModel {
  private db;
  private cache = new NodeCache({ stdTTL: 10 * 60, checkperiod: 120 });

  constructor(db: knex.Knex<any, unknown[]>) {
    this.db = db;
  }

  // Create a new traveler
  async createTraveler(travelerData: ITravellersBody) {
    const [id] = await this.db("air_travelers").insert(travelerData, "id");
    return id;
  }

  // Retrieve a single traveler by ID (with caching)
  async getTravelerById(id: number) {
    const cached = this.cache.get(id.toString());

    if (cached) {
      return cached;
    }

    const traveler = await this.db("air_travelers")
      .select(
        "id",
        "user_id",
        "PassengerType",
        "Gender",
        "PassengerTitle",
        "PassengerFirstName",
        "PassengerLastName",
        "DateOfBirth",
        "PassengerNationality",
        "NationalID",
        "PassportNumber",
        "ExpiryDate",
        "Country"
      )
      .where({ id })
      .first();

    if (traveler) {
      this.cache.set(id.toString(), traveler);
    }

    return traveler;
  }

  // Retrieve all travelers
  async getAllTravelers(user_id: number) {
    return this.db("air_travelers")
      .select(
        "id",
        "user_id",
        "PassengerType",
        "Gender",
        "PassengerTitle",
        "PassengerFirstName",
        "PassengerLastName",
        "DateOfBirth",
        "PassengerNationality",
        "NationalID",
        "PassportNumber",
        "ExpiryDate",
        "Country"
      )
      .orderBy("PassengerFirstName")
      .where({ user_id });
  }

  // Update a traveler's details
  async updateTraveler(id: number, updatedData: Partial<ITravellersBody>) {
    await this.db("air_travelers").where({ id }).update(updatedData);
    this.cache.del(id.toString()); // Clear cache after update
    return this.getTravelerById(id); // Return updated record
  }

  // Delete a traveler
  async deleteTraveler(id: number) {
    await this.db("air_travelers").where({ id }).del();
    this.cache.del(id.toString()); // Clear cache after deletion
    return { message: `Traveler with ID ${id} deleted successfully.` };
  }
}
