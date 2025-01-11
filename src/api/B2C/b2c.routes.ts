import { Router } from "express";
import { authMiddleware } from "../../middlewares/authMiddlewares";
import { PreBookingRoutes } from "./preBooking/routes/preBooking.routes";
import { TravelersRoute } from "./travelers/travelers.routes";
import { B2cUsersRoute } from "./users/b2cUsers.routes";

export class B2CRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.use("/", new PreBookingRoutes().router);
    this.router.use("/user", authMiddleware, new B2cUsersRoute().router);
    this.router.use("/travelers", authMiddleware, new TravelersRoute().router);
  }
}
