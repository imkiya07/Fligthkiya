import { Router } from "express";
import { FlightController } from "./flightController";

export class FlightRouter {
  public router: Router;
  private flightController = new FlightController();

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post("/search", this.flightController.flightSearch);

    this.router.post("/revalidated", this.flightController.revalidated);
  }
}
