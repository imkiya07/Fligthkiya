import { Request, Response } from "express";
import { CommonService } from "./commonServices";
import { AbstractController } from "../../utils/abstracts/abstractController";

export class CommonController extends AbstractController {
  private services: CommonService;

  constructor() {
    super();
    this.services = new CommonService();
  }

  // Use an arrow function
  public getAllAirports = this.wrapAsync(
    async (req: Request, res: Response) => {
      const data = await this.services.getAllAirports();
      res.json(data);
    }
  );
}
