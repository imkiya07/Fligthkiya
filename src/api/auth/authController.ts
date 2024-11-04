import { Request, Response } from "express";
import { AbstractController } from "../../core/abstract/abstractController";
import { AuthServices } from "./authServices";

export class AuthController extends AbstractController {
  private services: AuthServices;

  constructor() {
    super();
    this.services = new AuthServices();
  }

  // create session id
  public registrationUser = this.wrapAsync(
    async (req: Request, res: Response) => {
      const data = await this.services.registrationUser(req);
      res.json(data);
    }
  );

  // Use an arrow function
  public loginUser = this.wrapAsync(async (req: Request, res: Response) => {
    const data = await this.services.loginUser(req);
    res.json(data);
  });

  // Use an arrow function
  public refreshToken = this.wrapAsync(async (req: Request, res: Response) => {
    const data = await this.services.refreshToken(req);
    res.json(data);
  });
}
