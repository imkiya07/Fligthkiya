import { Router } from "express";
import { AdminUsersController } from "./adminUsers.controller";

export class AdminUsersRouters {
  public router: Router;
  private controller = new AdminUsersController();

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/", this.controller.allUsers);
    this.router.get("/bookings", this.controller.bookingInfos);
    this.router.get("/bookings/:id", this.controller.userWiseBooking);
    this.router.get("/cancel-req", this.controller.getCancelBookingReq);
    this.router.patch(
      "/cancel-req/:id",
      this.controller.updateCancelBookingReq
    );
  }
}
