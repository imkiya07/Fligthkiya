import { Router } from "express";
import { AuthController } from "./authController";
import { authMiddleware } from "../../middlewares/authMiddlewares";

export class AuthRoutes {
  public router: Router;
  private controller: AuthController;

  constructor() {
    this.router = Router();
    this.controller = new AuthController();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post("/registration", this.controller.registrationUser);
    this.router.post("/login", this.controller.loginUser);
    this.router.get(
      "/refresh-token",
      authMiddleware,
      this.controller.refreshToken
    );
  }
}
