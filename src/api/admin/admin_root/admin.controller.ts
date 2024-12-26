import { Request, Response } from "express";
import { AbstractController } from "../../../core/abstract/abstractController";
import { AdminServices } from "./admin.service";

export class AdminController extends AbstractController {
  private services = new AdminServices();
  constructor() {
    super();
  }

  public cancelBooking = this.wrapAsync(async (req: Request, res: Response) => {
    const data = await this.services.cancelBooking(req);
    res.json(data);
  });

  public searchInvoice = this.wrapAsync(async (req: Request, res: Response) => {
    const data = await this.services.searchInvoice(req);
    res.json(data);
  });

  public scheduleChange = this.wrapAsync(
    async (req: Request, res: Response) => {
      const data = await this.services.scheduleChange(req);
      res.json(data);
    }
  );

  public voidRequest = this.wrapAsync(async (req: Request, res: Response) => {
    const data = await this.services.voidRequest(req);
    res.json(data);
  });

  public reissueRequest = this.wrapAsync(
    async (req: Request, res: Response) => {
      const data = await this.services.reissueRequest(req);
      res.json(data);
    }
  );

  public refundRequest = this.wrapAsync(async (req: Request, res: Response) => {
    const data = await this.services.refundRequest(req);
    res.json(data);
  });
}
