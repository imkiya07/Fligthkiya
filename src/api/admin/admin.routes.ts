import { Router } from "express";
import { AdminAuthRouters } from "./auth/adminAuth.routes";
import { AdminUsersRouters } from "./users/adminUsers.routes";
import { AdminRootRoutes } from "./admin_root/adminRoot.routes";

export class AdminRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.use("/", new AdminRootRoutes().router);
    this.router.use("/auth", new AdminAuthRouters().router);
    this.router.use("/users", new AdminUsersRouters().router);
  }
}

export const adminRouter = new AdminRouter().router;
