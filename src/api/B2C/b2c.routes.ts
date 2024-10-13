import { Router } from "express";
import { PostbookingRoutes } from "./postbooking/routes/postbooking.routes";
import { PrebookingRoutes } from "./prebooking/routes/prebooking.routes";

export class B2CRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.use("/", new PrebookingRoutes().router);
    this.router.use("/", new PostbookingRoutes().router);
  }
}
