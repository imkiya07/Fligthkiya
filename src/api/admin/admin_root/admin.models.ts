import knex from "knex";

export class AdminMOdels {
  private db;
  constructor(db: knex.Knex<any, unknown[]>) {
    this.db = db;
  }

  insertAdmin = async (payload: any) => {
    const [id] = await this.db("users").insert(payload);
    return id;
  };

  getAdminUser = async (username: string) => {
    return await this.db("users")
      .select(
        "user_id",
        "user_type",
        "full_name",
        "email",
        "phone_number",
        "password_hash"
      )
      .where("user_type", "ADMIN")
      .andWhere((e) => {
        e.whereRaw("username like ?", [username]).orWhereRaw("email like ?", [
          username,
        ]);
      })
      .first();
  };
}
