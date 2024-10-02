import { Router, Request, Response } from "express";

export class PublicRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/flights", (req: Request, res: Response) => {
      res.json({ message: "Available flights (Public)" });
    });

    this.router.get("/flight/:id", (req: Request, res: Response) => {
      res.json({ message: "Flight details (Public)" });
    });
  }
}

export const publicRouter = new PublicRouter().router;
