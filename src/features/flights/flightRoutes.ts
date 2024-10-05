import { Request, Response, Router } from "express";
import { FlightController } from "./flightController";

export class FlightRouter {
  public router: Router;
  private flightController: FlightController;

  constructor() {
    this.router = Router();
    this.flightController = new FlightController();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/search", (req: Request, res: Response) =>
      this.flightController.flightSearch(req, res)
    );
    this.router.get("/flights", (req: Request, res: Response) =>
      this.flightController.getFlights(req, res)
    );

    this.router.get("/flights/:id", (req: Request, res: Response) =>
      this.flightController.getFlightById(req, res)
    );

    this.router.post("/flights", (req: Request, res: Response) =>
      this.flightController.createFlight(req, res)
    );

    this.router.put("/flights/:id", (req: Request, res: Response) =>
      this.flightController.updateFlight(req, res)
    );

    this.router.delete("/flights/:id", (req: Request, res: Response) =>
      this.flightController.deleteFlight(req, res)
    );
  }
}
