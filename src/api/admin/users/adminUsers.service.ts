import { Request } from "express";
import AbstractServices from "../../../core/abstract/abstract.services";
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
}
