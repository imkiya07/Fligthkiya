import { Router } from "express";
import { authMiddleware } from "../../middlewares/authMiddlewares";
import { AdminAuthValidator } from "../admin/auth/adminAuth.validator";
import { AuthController } from "./authController";

export class AuthRoutes {
  public router: Router;
  private controller: AuthController;
  private validator = new AdminAuthValidator();

  constructor() {
    this.router = Router();
    this.controller = new AuthController();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post("/registration", this.controller.registrationUser);
    this.router.post("/login", this.controller.loginUser);
    this.router.post(
      "/admin-login",
      this.validator.loginAdmin,
      this.controller.loginAdmin
    );
    this.router.get(
      "/refresh-token",
      authMiddleware,
      this.controller.refreshToken
    );

    this.router.patch("/reset-pass", this.controller.requestPasswordReset);
    this.router.patch("/reset-pass/:token", this.controller.resetPassword);
  }
}
