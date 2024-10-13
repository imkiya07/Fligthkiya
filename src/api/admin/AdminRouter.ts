import { Router, Request, Response } from "express";

export class AdminRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/dashboard", (req: Request, res: Response) => {
      res.json({ message: "Admin dashboard" });
    });

    this.router.get("/manage-flights", (req: Request, res: Response) => {
      res.json({ message: "Manage Flights (Admin)" });
    });
  }
}

export const adminRouter = new AdminRouter().router;
