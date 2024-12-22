import { Request } from "express";
import AbstractServices from "../../../core/abstract/abstract.services";
import { IAdminBookingUpdateDb } from "../../B2C/users/b2cUsers.interface";
import { B2cUsersModel } from "../../B2C/users/b2cUsers.models";
import { AdminUsersModels } from "./adminUsers.model";

export class AdminUsersServices extends AbstractServices {
  constructor() {
    super();
  }
  /**
   * @allUsers
   */
  allUsers = async (req: Request) => {
    const query = req.query;

    const conn = new AdminUsersModels(this.db);

    const data = await conn.getAllUsers(query);

    return {
      success: true,
      ...data,
    };
  };

  /**
   * @bookingInfos
   */
  bookingInfos = async (req: Request) => {
    const query = req.query;

    const conn = new AdminUsersModels(this.db);

    const data = await conn.bookingsInfo(query);

    return {
      success: true,
      ...data,
    };
  };

  /**
   * @userWiseBooking
   */
  userWiseBooking = async (req: Request) => {
    const userId = +req.params.id;

    const conn = new AdminUsersModels(this.db);

    const user = conn.getUserById(userId);

    if (!user) {
      throw this.throwError("Invalid user id", 400);
    }

    const data = await conn.userWiseBookings(userId);

    return {
      success: true,
      data,
    };
  };

  getCancelBookingReq = async (req: Request) => {
    const conn = new B2cUsersModel(this.db);

    const { limit, skip, req_type, status } = req.query as {
      limit: string;
      skip: string;
      req_type: string;
      status: string;
    };

    const data = await conn.getUpdateBooking(+limit, +skip, req_type, status);

    return {
      success: true,
      ...data,
    };
  };

  updateCancelBookingReq = async (req: Request) => {
    const conn = new B2cUsersModel(this.db);
    const id = +req.params.id;

    const body = req.body as IAdminBookingUpdateDb;

    await conn.UpdateRefundBooking(body, id);

    return {
      success: true,
      message: "Updated successfully",
    };
  };
}
