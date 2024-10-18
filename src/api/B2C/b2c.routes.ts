import { Router } from "express";
import { PreBookingRoutes } from "./preBooking/routes/preBooking.routes";
import { PostBookingRoutes } from "./postBooking/routes/postBooking.routes";

export class B2CRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.use("/", new PreBookingRoutes().router);
    this.router.use("/", new PostBookingRoutes().router);
  }
}
