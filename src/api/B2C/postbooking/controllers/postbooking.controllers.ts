import { Request, Response } from "express";
import { AbstractController } from "../../../../utils/abstracts/abstractController";
import { PostbookingService } from "../services/postbooking.services";

export class PostbookingControllers extends AbstractController {
  private services = new PostbookingService();
  constructor() {
    super();
  }

  // FARE RULES
  public fareRules = this.wrapAsync(async (req: Request, res: Response) => {
    const flights = await this.services.fareRules(req);
    res.json(flights);
  });
}
