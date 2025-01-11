import { Router } from "express";
import { TravelersController } from "./travelers.controllers";

export class TravelersRoute {
  public router: Router;
  private controller = new TravelersController();

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router
      .route("/")
      .post(this.controller.createTraveler)
      .get(this.controller.getAllTravelers);

    this.router
      .route("/:id")
      .patch(this.controller.updateTraveler)
      .get(this.controller.getTravelerById)
      .delete(this.controller.deleteTraveler);
  }
}
