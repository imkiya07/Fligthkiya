import { Request, Response } from "express";
import { AbstractController } from "../../../core/abstract/abstractController";
import { AdminUsersServices } from "./adminUsers.service";

export class AdminUsersController extends AbstractController {
  private services = new AdminUsersServices();
  constructor() {
    super();
  }

  public allUsers = this.wrapAsync(async (req: Request, res: Response) => {
    const data = await this.services.allUsers(req);
    res.json(data);
  });

  public bookingInfos = this.wrapAsync(async (req: Request, res: Response) => {
    const data = await this.services.bookingInfos(req);
    res.json(data);
  });

  public userWiseBooking = this.wrapAsync(
    async (req: Request, res: Response) => {
      const data = await this.services.userWiseBooking(req);
      res.json(data);
    }
  );

  public getCancelBookingReq = this.wrapAsync(
    async (req: Request, res: Response) => {
      const data = await this.services.getCancelBookingReq(req);
      res.json(data);
    }
  );

  public updateCancelBookingReq = this.wrapAsync(
    async (req: Request, res: Response) => {
      const data = await this.services.updateCancelBookingReq(req);
      res.json(data);
    }
  );
}
