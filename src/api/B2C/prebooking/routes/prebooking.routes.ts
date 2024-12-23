import { Router } from "express";
import { authMiddleware } from "../../../../middlewares/authMiddlewares";
import { PreBookingControllers } from "../controllers/preBooking.controllers";
import { PreBookingValidator } from "../validators/preBooking.validators";

export class PreBookingRoutes {
  public router: Router;
  private controllers = new PreBookingControllers();
  private validator = new PreBookingValidator();

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post("/search", this.controllers.flightSearch);

    this.router.get("/revalidated/:flight_id", this.controllers.revalidated);

    this.router.get("/fare-rules/:flight_id", this.controllers.fareRules);

    this.router.post(
      "/booking",
      this.validator.bookingReq,
      this.controllers.bookingRequest
    );

    this.router.post(
      "/order-ticket/:id",
      authMiddleware,
      this.controllers.orderTicket
    );

    this.router.get("/trip-details/:booking_ref", this.controllers.tripDetails);

    this.router.get("/seat-map/:flight_id", this.controllers.seatMap);
  }
}
