import { Router } from "express";
import { PostbookingControllers } from "../controllers/postbooking.controllers";

export class PostbookingRoutes {
  public router: Router;
  private controllers = new PostbookingControllers();

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/fare-rules", this.controllers.fareRules);
  }
}
