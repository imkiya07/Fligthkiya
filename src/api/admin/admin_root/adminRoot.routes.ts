import { Router } from "express";
import { AdminController } from "./admin.controller";

export class AdminRootRoutes {
  public router: Router;
  private controller = new AdminController();

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post("/add", this.controller.cancelBooking);
    this.router.post("/add", this.controller.searchInvoice);
    this.router.post("/add", this.controller.scheduleChange);
    this.router.post("/void", this.controller.voidRequest);
    this.router.post("/reissue", this.controller.reissueRequest);
    this.router.post("/refund", this.controller.refundRequest);
  }
}
