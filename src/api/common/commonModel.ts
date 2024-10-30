import knex from "knex";

export class CommonModel {
  private db;
  constructor(db: knex.Knex<any, unknown[]>) {
    this.db = db;
  }

  getAllAirports(size = "20", search: string) {
    return (
      this.db("airports")
        .select("id", "name", "city", "country", "iata")
        .where((builder) => {
          if (search) {
            builder
              .whereRaw("iata LIKE ?", [`%${search}%`])
              .orWhereRaw("name LIKE ?", [`%${search}%`])
              .orWhereRaw("city LIKE ?", [`%${search}%`])
              .orWhereRaw("country LIKE ?", [`%${search}%`]);
          }
        })
        // Sort results by giving priority to exact matches in the IATA code
        .orderByRaw("CASE WHEN iata LIKE ? THEN 0 ELSE 1 END", [`${search}%`])
        .limit(Number(size))
    );
  }
}
