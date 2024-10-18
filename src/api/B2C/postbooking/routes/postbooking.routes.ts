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
    this.router.get("/fare-rules", this.controllers.bookingNote);
    this.router.patch("/cancel-booking", this.controllers.cancelBooking);
    this.router.get("/fare-rules", this.controllers.changeSchedule);
    this.router.get("/fare-rules", this.controllers.invoice);
    this.router.get("/fare-rules", this.controllers.postTicketingReq);
    this.router.get("/fare-rules", this.controllers.acceptChangeSchedule);
  }
}
