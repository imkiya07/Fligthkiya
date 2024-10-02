import { Express } from "express";
import { publicRouter } from "../features/public/PublicRouter";
import { adminRouter } from "../features/admin/AdminRouter";
import { b2bRouter } from "../features/B2B/B2BRouter";
import { FlightRouter } from "../features/flights/flightRoutes";

export function registerRoutes(app: Express): void {
  // Public routes
  app.use("/api/public", publicRouter);

  // Admin routes
  app.use("/api/admin", adminRouter);

  // B2B routes
  app.use("/api/b2b", b2bRouter);

  // Flight routes
  app.use("/api/flights", new FlightRouter().router);
}
