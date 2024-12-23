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
    this.router.post("/add", this.controller.voidRequest);
    this.router.post("/add", this.controller.voidRequestQuote);
    this.router.post("/add", this.controller.reissueRequest);
    this.router.post("/add", this.controller.reissueRequestQuote);
    this.router.post("/add", this.controller.refundRequest);
    this.router.post("/add", this.controller.refundRequestQuote);
  }
}
