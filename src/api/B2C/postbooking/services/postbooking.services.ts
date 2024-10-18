import { Request } from "express";
import AbstractServices from "../../../../core/abstract/abstract.services";

export class PostBookingService extends AbstractServices {
  constructor() {
    super();
  }

  // NARROW SERVICES
  fareRules = async (req: Request) => {
    return { success: true, message: "Fare Rules" };
  };

  // CANCEL BOOKING
  cancelBooking = async (req: Request) => {
    return { success: true, message: "Fare Rules" };
  };

  // BOOKING NOTES
  bookingNote = async (req: Request) => {
    return { success: true, message: "Fare Rules" };
  };

  // INVOICE
  invoice = async (req: Request) => {
    return { success: true, message: "Fare Rules" };
  };

  // POST TICKETING REQUEST
  postTicketingReq = async (req: Request) => {
    return { success: true, message: "Fare Rules" };
  };

  // SCHEDULE CHANGE
  changeSchedule = async (req: Request) => {
    return { success: true, message: "Fare Rules" };
  };
}
