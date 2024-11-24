import knex from "knex";
import {
  IAirTravelers,
  IBookingInfo,
} from "../interfaces/bookingReqBody.interface";
import { IAirTravelersRequest } from "../interfaces/preBooking.interface";

export class BookingModels {
  private db;
  constructor(db: knex.Knex<any, unknown[]>) {
    this.db = db;
  }

  insertAirTravelers = async (payload: IAirTravelers[]) => {
    await this.db("air_travelers").insert(payload);
  };

  deleteAirTravelers = async (booking_id: number) => {
    await this.db("air_travelers").delete().where("booking_id", booking_id);
  };

  insertBookingInfo = async (payload: IBookingInfo) => {
    const [id] = await this.db("booking_info").insert(payload);

    return id;
  };

  updateBookingInfo = async (payload: IBookingInfo, booking_id: number) => {
    await this.db("booking_info")
      .update(payload)
      .where("booking_id", booking_id);
  };

  updateBookingPayment = async (
    payload: { baseFare: number; netTotal: number },
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

  updateBookingBookingStatus = async (
    bookingStatus: "PENDING" | "CONFIRMED" | "FAILED",
    booking_id: number
  ) => {
    const canceledAt = getCurrentTimestamp();

    await this.db("booking_info")
      .update({ bookingStatus, canceledAt })
      .where("id", booking_id);
  };

  updateBookingConfirm = async (
    payload: {
      TraceId: string;
      ticketStatus:
        | "PENDING"
        | "BOOKED"
        | "ISSUED"
        | "PAYMENT"
        | "CANCEL_PENDING"
        | "CANCELED";
      TktTimeLimit: string;
      pnrId: string;
      bookingStatus: "PENDING" | "CONFIRMED" | "FAILED";
    },
    booking_id: number
  ) => {
    const date = new Date(payload?.TktTimeLimit);

    const TktTimeLimit = date.toISOString().slice(0, 19).replace("T", " ");

    await this.db("booking_info")
      .update({ ...payload, TktTimeLimit })
      .where("id", booking_id);
  };

  getBookingBodyInfo = async (booking_id: number) => {
    return (await this.db("booking_info")
      .select("revalidation_req_body", "passengerBody")
      .where("id", booking_id)
      .first()) as {
      passengerBody: string;
      revalidation_req_body: string;
    };
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
