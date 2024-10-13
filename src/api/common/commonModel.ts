import knex from "knex";

export class CommonModel {
  private db;
  constructor(db: knex.Knex<any, unknown[]>) {
    this.db = db;
  }

  getAllAirports(size: string = "20", search: string) {
    return this.db("airports")
      .select("id", "name", "city", "country", "iata")
      .where((builder) => {
        builder.whereRaw("name LIKE ?", [`%${search}%`])
        .orWhereRaw("city LIKE ?", [`%${search}%`])
        .orWhereRaw("country LIKE ?", [`%${search}%`])
        .orWhereRaw("iata LIKE ?", [`%${search}%`])
      })

      .limit(Number(size));
  }
}
