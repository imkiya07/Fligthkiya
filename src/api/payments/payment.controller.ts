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

  public paymentSuccess = this.wrapAsync(
    async (req: Request, res: Response) => {
      const data = await this.services.paymentSuccess(req);
      res.json(data);
    }
  );

  public paymentSuccessMailSend = this.wrapAsync(
    async (req: Request, res: Response) => {
      const data = await this.services.paymentSuccessMailSend(req);
      res.json(data);
    }
  );

  public paymentCancel = this.wrapAsync(async (req: Request, res: Response) => {
    const data = await this.services.paymentCancel(req);
    res.json(data);
  });

  public appsPaymentIntent = this.wrapAsync(
    async (req: Request, res: Response) => {
      const data = await this.services.appsPaymentIntent(req);
      res.json(data);
    }
  );
}
