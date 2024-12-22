import knex from "knex";
import { IAdminBookingUpdateDb, IUpdateBookingDB } from "./b2cUsers.interface";

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
        "ticketStatus",
        "origin",
        "destination",
        "airline",
        "flight_no",
        "departure_datetime"
      )
      .where("user_id", userId);
  };

  getUpdateBooking = async (
    limit: number = 20,
    skip: number = 0,
    req_type: string,
    status: string,
    user_id?: number
  ) => {
    const data = await this.db("refund_or_void_requests as t")
      .select(
        "t.id",
        "request_type",
        "reason",
        "remarks",
        "amount",
        "status",
        "admin_comments",
        "t.created_at",
        "user_type",
        "full_name",
        "users.email",
        "phone_number",
        "orderNumber",
        "CountryCode",
        "AreaCode",
        "PhoneNumber",
        "b.Email",
        "PostCode",
        "bookingStatus",
        "IsPriceChange",
        "IsScheduleChange",
        "pnrId",
        "TktTimeLimit",
        "baseFare",
        "taxAndCharge",
        "discount",
        "appliedCoupon",
        "netTotal",
        "paymentStatus",
        "ticketStatus",
        "departure_datetime"
      )
      .modify((e) => {
        if (req_type) e.andWhere("request_type", req_type);
        if (status) e.andWhere("status", status);
        if (user_id) e.andWhere("t.user_id", user_id);
      })
      .leftJoin("users", "users.user_id", "t.user_id")
      .leftJoin("booking_info as b", "b.id", "t.id")
      .orderBy("t.id", "desc")
      .limit(limit)
      .offset(skip);

    const countData = await this.db("refund_or_void_requests as t")
      .count("* as count")
      .modify((e) => {
        if (req_type) e.andWhere("request_type", req_type);
        if (status) e.andWhere("status", status);
        if (user_id) e.andWhere("t.user_id", user_id);
      })
      .first();

    return { count: countData?.count, data };
  };

  insertUpdateBooking = async (payload: IUpdateBookingDB) => {
    await this.db("refund_or_void_requests").insert(payload);
  };

  UpdateRefundBooking = async (payload: IAdminBookingUpdateDb, id: number) => {
    await this.db("refund_or_void_requests").update(payload).where("id", id);
  };

  updateBookingInfo = async (
    ticketStatus: "CANCEL_PENDING" | "CANCELED",
    id: number
  ) => {
    await this.db("booking_info")
      .update("ticketStatus", ticketStatus)
      .where("id", id);
  };
}
