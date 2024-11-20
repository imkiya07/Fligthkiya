import { Router } from "express";
import { PreBookingRoutes } from "./preBooking/routes/preBooking.routes";

export class B2CRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.use("/", new PreBookingRoutes().router);
  }
}
