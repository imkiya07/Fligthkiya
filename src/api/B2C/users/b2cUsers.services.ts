import { Request } from "express";
import AbstractServices from "../../../core/abstract/abstract.services";
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
}
