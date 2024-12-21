import { Request, Response } from "express";
import { AbstractController } from "../../../core/abstract/abstractController";
import { AdminAuthServices } from "./adminAuth.service";

export class AdminAuthController extends AbstractController {
  private services = new AdminAuthServices();
  constructor() {
    super();
  }

  public createAdmin = this.wrapAsync(async (req: Request, res: Response) => {
    const data = await this.services.createAdmin(req);
    res.json(data);
  });
}
