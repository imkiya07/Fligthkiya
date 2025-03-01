import knex from "knex";
import {
  IAirTravelers,
  IBookingInfo,
} from "../interfaces/bookingReqBody.interface";

export class BookingModels {
  private db;
  constructor(db: knex.Knex<any, unknown[]>) {
    this.db = db;
  }

  deleteAirTravelers = async (booking_id: number) => {
    await this.db("air_travelers").delete().where("id", booking_id);
  };

  insertBookingInfo = async (payload: IBookingInfo) => {
    const [id] = await this.db("booking_info").insert(payload);

    return id;
  };

  updateBookingInfo = async (payload: any, booking_id: number) => {
    await this.db("booking_info").update(payload).where("id", booking_id);
  };

  updateBookingPayment = async (
    payload: {
      baseFare: number;
      netTotal: number;
      origin: string;
      destination: string;
    },
    booking_id: number
  ) => {
    await this.db("booking_info").update(payload).where("id", booking_id);
  };

  updateBookingPaymentStatus = async (
    paymentStatus: "PENDING" | "SUCCESS" | "FAILED" | "CANCEL",
    booking_id: number
  ) => {
    const paymentAt = getCurrentTimestamp();

    await this.db("booking_info")
      .update({ paymentStatus, paymentAt })
      .where("id", booking_id);
  };

  updateBookingConfirm = async (
    payload: {
      TraceId: string;
      ticketStatus: string;
      TktTimeLimit: string;
      pnrId: string;
    },
    booking_id: number
  ) => {
    const date = new Date(payload?.TktTimeLimit);

    const TktTimeLimit = date.toISOString().slice(0, 19).replace("T", " ");

    await this.db("booking_info")
      .update({ ...payload, TktTimeLimit })
      .where("id", booking_id);
  };

  updateBookingTicketStatus = async (status: string, booking_id: number) => {
    await this.db("booking_info")
      .update("ticketStatus", status)
      .where("id", booking_id);
  };

  getBookingBodyInfo = async (booking_id: number) => {
    return (await this.db("booking_info")
      .select("revalidation_req_body", "passengerBody", "orderNumber")
      .where("id", booking_id)
      .first()) as {
      passengerBody: string;
      revalidation_req_body: string;
      orderNumber: string;
    };
  };

  getBookingById = async (bookingId: number | string) => {
    return await this.db("booking_info")
      .select([
        "booking_info.id",
        "booking_info.orderNumber",
        "booking_info.PhoneNumber",
        "booking_info.Email",
        "booking_info.ticketStatus",
        "booking_info.paymentStatus",
        "booking_info.paymentAt",
        "booking_info.pnrId",
        "booking_info.baseFare",
        "booking_info.taxAndCharge",
        "booking_info.discount",
        "booking_info.appliedCoupon",
        "booking_info.netTotal",
        "booking_info.revalidation_req_body",
        "booking_info.passengerBody",
        "booking_info.departure_datetime",
        "u.full_name",
        "u.username",
      ])
      .leftJoin("users as u", "u.user_id", "booking_info.user_id")
      .where("id", bookingId)
      .first();
  };
}

export function getCurrentTimestamp() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
