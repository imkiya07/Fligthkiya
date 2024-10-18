import { Request, Response } from "express";
import { AbstractController } from "../../../../core/abstract/abstractController";
import { PostBookingService } from "../services/postBooking.services";

export class PostBookingControllers extends AbstractController {
  private services = new PostBookingService();
  constructor() {
    super();
  }

  // FARE RULES
  public fareRules = this.wrapAsync(async (req: Request, res: Response) => {
    const flights = await this.services.fareRules(req);
    res.json(flights);
  });
}
