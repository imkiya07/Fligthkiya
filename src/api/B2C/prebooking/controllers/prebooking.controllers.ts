import { Request, Response } from "express";
import { AbstractController } from "../../../../utils/abstracts/abstractController";
import { PrebookingService } from "../services/prebooking.services";

export class PrebookingControllers extends AbstractController {
  private services = new PrebookingService();
  constructor() {
    super();
  }

  public flightSearch = this.wrapAsync(async (req: Request, res: Response) => {
    const data = await this.services.flightSearch(req);
    res.json(data);
  });

  // REVALIDATED FLIGHT
  public revalidated = this.wrapAsync(async (req: Request, res: Response) => {
    const data = await this.services.revalidated(req);
    res.json(data);
  });

  // FARE RULES
  public fareRules = this.wrapAsync(async (req: Request, res: Response) => {
    const data = await this.services.fareRules(req);
    res.json(data);
  });

  // FLIGHT BOOK
  public flightBook = this.wrapAsync(async (req: Request, res: Response) => {
    const data = await this.services.flightBook(req);
    res.json(data);
  });
}
