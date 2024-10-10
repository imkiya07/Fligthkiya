import { Request, Response } from "express";
import { AbstractController } from "../../../utils/abstracts/abstractController";
import { FlightService } from "./services/flightService";

export class FlightController extends AbstractController {
  private flightService = new FlightService();
  constructor() {
    super();
  }

  public flightSearch = this.wrapAsync(async (req: Request, res: Response) => {
    const flights = await this.flightService.flightSearch(req);
    res.json(flights);
  });

  // REVALIDATED FLIGHT
  public revalidated = this.wrapAsync(async (req: Request, res: Response) => {
    const flights = await this.flightService.revalidated(req);
    res.json(flights);
  });
}
