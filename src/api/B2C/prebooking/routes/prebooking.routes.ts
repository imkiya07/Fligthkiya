import { Router } from "express";
import checkSessionId from "../../../../middlewares/checkSessionId";
import { PreBookingControllers } from "../controllers/preBooking.controllers";

export class PreBookingRoutes {
  public router: Router;
  private controllers = new PreBookingControllers();

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post("/search", this.controllers.flightSearch);

    this.router.get(
      "/revalidated/:flight_id",
      checkSessionId,
      this.controllers.revalidated
    );

    this.router.get(
      "/fare-rules/:flight_id",
      checkSessionId,
      this.controllers.fareRules
    );

    this.router.post(
      "/flight-book",
      checkSessionId,
      this.controllers.flightBook
    );

    this.router.get("/order-ticket", this.controllers.orderTicket);

    this.router.get("/trip-details/:booking_ref", this.controllers.tripDetails);
  }
}
