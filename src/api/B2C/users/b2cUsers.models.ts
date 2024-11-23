import knex from "knex";

export class B2cUsersModel {
  private db;
  constructor(db: knex.Knex<any, unknown[]>) {
    this.db = db;
  }

  getBookings = async (userId: number) => {
    return await this.db("booking_info")
      .select(
        "id",
        "orderNumber",
        "CountryCode",
        "Email",
        "bookingStatus",
        "pnrId",
        "TktTimeLimit",
        "BaseFare",
        "taxAndCharge",
        "discount",
        "appliedCoupon",
        "netTotal",
        "paymentStatus",
        "ticketStatus"
      )
      .where("user_id", userId);
  };
}
