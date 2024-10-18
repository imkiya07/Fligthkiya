import { Request, Response } from "express";
import { AbstractController } from "../../../../core/abstract/abstractController";
import { PostBookingService } from "../services/postBooking.services";

export class PostBookingControllers extends AbstractController {
  private services = new PostBookingService();
  constructor() {
    super();
  }

  public cancelBooking = this.wrapAsync(async (req: Request, res: Response) => {
    const data = await this.services.cancelBooking(req);
    res.json(data);
  });

  public bookingNote = this.wrapAsync(async (req: Request, res: Response) => {
    const data = await this.services.bookingNote(req);
    res.json(data);
  });

  public invoice = this.wrapAsync(async (req: Request, res: Response) => {
    const data = await this.services.invoice(req);
    res.json(data);
  });

  public postTicketingReq = this.wrapAsync(
    async (req: Request, res: Response) => {
      const data = await this.services.postTicketingReq(req);
      res.json(data);
    }
  );

  public changeSchedule = this.wrapAsync(
    async (req: Request, res: Response) => {
      const data = await this.services.changeSchedule(req);
      res.json(data);
    }
  );

  public acceptChangeSchedule = this.wrapAsync(
    async (req: Request, res: Response) => {
      const data = await this.services.acceptChangeSchedule(req);
      res.json(data);
    }
  );
}
