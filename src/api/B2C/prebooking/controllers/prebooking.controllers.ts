import { Request, Response } from "express";
import { AbstractController } from "../../../../core/abstract/abstractController";
import { PreBookingService } from "../services/preBooking.services";

export class PreBookingControllers extends AbstractController {
  private services = new PreBookingService();
  constructor() {
    super();
  }

  public flightSearch = this.wrapAsync(async (req: Request, res: Response) => {
    const data = await this.services.flightSearch(req);

    res.cookie("deviceId", data?.deviceId, {
      maxAge: 1800000, // 30 min
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Only use secure cookies in production
      sameSite: "strict", // Prevents CSRF attacks
    });

    res.json(data);
  });

  // REVALIDATED FLIGHT
  public revalidated = this.wrapAsync(async (req: Request, res: Response) => {
    const data = await this.services.revalidated(req);
    res.json(data);
  });

  // FARE RULES
  public fareRules = this.wrapAsync(async (req: Request, res: Response) => {
    const data = await this.services.fareRules(req);
    res.json(data);
  });

  // FLIGHT BOOK
  public flightBook = this.wrapAsync(async (req: Request, res: Response) => {
    const data = await this.services.flightBook(req);
    res.json(data);
  });

  // ORDER TICKET
  public orderTicket = this.wrapAsync(async (req: Request, res: Response) => {
    const data = await this.services.orderTicket(req);
    res.json(data);
  });

  // TRIP DETAILS
  public tripDetails = this.wrapAsync(async (req: Request, res: Response) => {
    const data = await this.services.tripDetails(req);
    res.json(data);
  });

  // SEAT MAP
  public seatMap = this.wrapAsync(async (req: Request, res: Response) => {
    const data = await this.services.seatMap(req);
    res.json(data);
  });
  public getPaymentIntent = this.wrapAsync(
    async (req: Request, res: Response) => {
      const data = await this.services.getPaymentIntent(req);
      res.json(data);
    }
  );
}
