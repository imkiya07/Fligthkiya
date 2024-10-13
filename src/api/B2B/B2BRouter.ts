import { Router, Request, Response } from "express";

export class B2BRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/partners", (req: Request, res: Response) => {
      res.json({ message: "B2B Partners" });
    });

    this.router.get("/special-deals", (req: Request, res: Response) => {
      res.json({ message: "Special B2B deals" });
    });
  }
}

export const b2bRouter = new B2BRouter().router;
