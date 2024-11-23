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
      "/create-payment-intent/:id",
      this.controller.createPaymentIntent
    );

    this.router.post("/success/:session", this.controller.paymentSuccess);

    this.router.post("/cancel/:session", this.controller.paymentCancel);
  }
}
