import { Router } from "express";
import { CommonController } from "./commonController";

export class CommonRouter {
  public router: Router;
  private controller: CommonController;

  constructor() {
    this.router = Router();
    this.controller = new CommonController();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/session-id", this.controller.createSession);
    this.router.get("/airports", this.controller.getAllAirports);
    this.router.get("/download-err", this.controller.downloadErrLogs);
    this.router.get("/clear-err", this.controller.clearErrLogs);
    this.router.get("/download-logs", this.controller.dowloadAllLogs);
    this.router.get("/clear-logs", this.controller.clearAllLogs);
  }
}
