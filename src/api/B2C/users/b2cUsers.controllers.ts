import { Request, Response } from "express";
import { AbstractController } from "../../../core/abstract/abstractController";
import { B2cUsersServices } from "./b2cUsers.services";

export class B2cUsersController extends AbstractController {
  private services = new B2cUsersServices();
  constructor() {
    super();
  }

  public getBookings = this.wrapAsync(async (req: Request, res: Response) => {
    const data = await this.services.getBookings(req);
    res.json(data);
  });
}
