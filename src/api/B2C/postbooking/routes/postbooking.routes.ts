import { Router } from "express";
import { PostBookingControllers } from "../controllers/postBooking.controllers";

export class PostBookingRoutes {
  public router: Router;
  private controllers = new PostBookingControllers();

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/fare-rules", this.controllers.fareRules);
  }
}
