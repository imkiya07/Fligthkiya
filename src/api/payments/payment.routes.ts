import { Request, Response, Router } from "express";
import Stripe from "stripe";

export class PaymentRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      "/create-payment-intent",
      async (req: Request, res: Response) => {
        res.send({ success: true, data: req.body });
        return;

        const stripe = new Stripe(
          "pk_test_51JyCktCw0Qr73TDTKbWBfzdxh5a6RUNQY2cjiSWkd1h0lebKjoVGZwDYcapLCSqPrCXkbIOFiVMungiOamzrsnV900aOjBkPeC"
        );

        const { amount, currency } = req.body;

        try {
          // Create a payment intent with the amount and currency
          const paymentIntent = await stripe.paymentIntents.create({
            amount, // amount in smallest currency unit (e.g., cents for USD)
            currency,
          });

          res.status(200).json({
            clientSecret: paymentIntent.client_secret,
          });
        } catch (error: any) {
          res.status(500).json({ error: error.message });
        }
      }
    );
  }
}
