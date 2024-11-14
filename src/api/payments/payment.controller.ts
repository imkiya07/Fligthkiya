import { Request, Response } from "express";
import { AbstractController } from "../../core/abstract/abstractController";
import { PaymentServices } from "./payment.service";

export class PaymentControllers extends AbstractController {
  private services = new PaymentServices();
  constructor() {
    super();
  }

  public createPaymentIntent = this.wrapAsync(
    async (req: Request, res: Response) => {
      const data = await this.services.createPaymentIntent(req);
      res.json(data);
    }
  );
}
