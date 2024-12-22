import { Router } from "express";
import { B2cUsersController } from "./b2cUsers.controllers";

export class B2cUsersRoute {
  public router: Router;
  private controllers = new B2cUsersController();

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/bookings", this.controllers.getBookings);
    this.router.post("/cancel-booking-req", this.controllers.addCancelBooking);
    this.router.get("/cancel-booking-req", this.controllers.getCancelBooking);
  }
}
