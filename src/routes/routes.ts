import { Express } from "express";
import { adminRouter } from "../api/admin/AdminRouter";
import { b2bRouter } from "../api/B2B/B2BRouter";
import { B2CRoutes } from "../api/B2C/b2c.routes";
import { CommonRouter } from "../api/common/common.routes";
import { PaymentRoutes } from "../api/payments/payment.routes";
import { AuthRoutes } from "../api/auth/authRoutes";
import { authMiddleware } from "../middlewares/authMiddlewares";

export function registerRoutes(app: Express): void {
  // COMMON ROUTES
  app.use("/api/common", new CommonRouter().router);

  // ADMIN ROUTES
  app.use("/api/admin", adminRouter);

  // B2B ROUTES
  app.use("/api/b2b", b2bRouter);

  // B2C ROUTES
  app.use("/api/b2c", new B2CRoutes().router);

  // PAYMENT ROUTES
  app.use("/api/payment", authMiddleware, new PaymentRoutes().router);

  // AUTH ROUTES
  app.use("/api/auth", new AuthRoutes().router);
}
