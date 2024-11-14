import { Router } from "express";
import { PaymentControllers } from "./payment.controller";

export class PaymentRoutes {
  public router: Router;
  private controller = new PaymentControllers();

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      "/create-payment-intent",
      this.controller.createPaymentIntent
    );
  }
}
