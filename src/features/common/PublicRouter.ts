import { Request, Response, Router } from "express";
import { CommonController } from "./publicController";

export class CommonRouter {
  public router: Router;
  private controller: CommonController;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
    this.controller = new CommonController();
  }

  private initializeRoutes() {
    this.router.get("/airports", (req: Request, res: Response) => {
      return this.controller.getAllAirports(req, res);
    });

    this.router.get("/flight/:id", (req: Request, res: Response) => {
      res.json({ message: "Flight details (Public)" });
    });
  }
}

export const commonRouter = new CommonRouter().router;
