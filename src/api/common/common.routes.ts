import { Router } from "express";
import { CommonController } from "./commonController";

export class CommonRouter {
  public router: Router;
  private controller: CommonController;

  constructor() {
    this.router = Router();
    this.controller = new CommonController();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/session-id", this.controller.createSession);
    this.router.get("/airports", this.controller.getAllAirports);
  }
}
