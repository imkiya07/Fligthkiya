import { Request, Response, Router } from "express";
import { CommonController } from "./commonController";
import Stripe from "stripe";

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
    this.router.post(
      "/create-payment-intent",
      async (req: Request, res: Response) => {
        const stripe = new Stripe(
          "sk_test_51JyCktCw0Qr73TDTfCQ5UEpX4yeQwdn09fVhOfaRNGDmEKrjPAZDdt0vENe3wGbZixMmnjieuzD3feiVdfPHKUnc00lMoOoKXL"
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
