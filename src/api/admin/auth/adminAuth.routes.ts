import { Router } from "express";
import { AdminAuthController } from "./adminAuth.controller";
import { AdminAuthValidator } from "./adminAuth.validator";

export class AdminAuthRouters {
  public router: Router;
  private controller = new AdminAuthController();
  private validator = new AdminAuthValidator();

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      "/add",
      this.validator.validateUser,
      this.controller.createAdmin
    );
  }
}
