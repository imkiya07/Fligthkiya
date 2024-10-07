import knex from "knex";

export class CommonModel {
  private db;
  constructor(db: knex.Knex<any, unknown[]>) {
    this.db = db;
  }

  getAllAirports() {
    return this.db("airports").select("*");
  }
}
