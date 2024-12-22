import { Request } from "express";
import AbstractServices from "../../../core/abstract/abstract.services";
import { IUpdateBookingBody, IUpdateBookingDB } from "./b2cUsers.interface";
import { B2cUsersModel } from "./b2cUsers.models";

export class B2cUsersServices extends AbstractServices {
  constructor() {
    super();
  }

  // BOOKING REQUEST
  getBookings = async (req: Request) => {
    const conn = new B2cUsersModel(this.db);

    const data = await conn.getBookings(req.user_id);

    return {
      success: true,
      message: "Booking details",
      data,
    };
  };

  addCancelBooking = async (req: Request) => {
    const body = req.body as IUpdateBookingBody;

    const conn = new B2cUsersModel(this.db);

    const payload: IUpdateBookingDB = { ...body, user_id: req.user_id };

    await conn.insertUpdateBooking(payload);

    await conn.updateBookingInfo("CANCEL_PENDING", body.booking_id);

    return {
      success: true,
      message: "Booking update request successfully",
    };
  };

  getCancelBooking = async (req: Request) => {
    const conn = new B2cUsersModel(this.db);

    const { limit, skip, req_type, status } = req.query as {
      limit: string;
      skip: string;
      req_type: string;
      status: string;
    };

    const data = await conn.getUpdateBooking(
      +limit,
      +skip,
      req_type,
      status,
      req.user_id
    );

    return {
      success: true,
      ...data,
    };
  };
}
