import { Request } from "express";
import AbstractServices from "../../../../core/abstract/abstract.services";

export class PostBookingService extends AbstractServices {
  constructor() {
    super();
  }

  // CANCEL BOOKING
  cancelBooking = async (req: Request) => {
    const body = req.body as { UniqueID: string };
    const reqBody = {
      UniqueID: body.UniqueID,
      Target: process.env.API_TARGET,
      ConversationId: "string",
    };

    const response = await this.Req.request(
      "POST",
      "/v1/Booking/Cancel",
      reqBody
    );

    // API RESPONSE ERROR
    if (!response?.Success) {
      this.throwError(response?.Message, 400);
    }

    return { success: true, message: "Cancel booking!", data: response?.Data };
  };

  // BOOKING NOTES
  bookingNote = async (req: Request) => {
    const reqBody = {
      UniqueID: "string",
      Notes: ["string"],
      Target: "Development",
      ConversationId: "string",
    };

    const response = await this.Req.request(
      "POST",
      "/v1/BookingNotes",
      reqBody
    );

    // API RESPONSE ERROR
    if (!response?.Success) {
      this.throwError(response?.Message, 400);
    }

    return { success: true, message: "Booking note!", response };
  };

  // INVOICE
  invoice = async (req: Request) => {
    const reqBody = {
      Page: 1,
    };

    const response = await this.Req.request("POST", "/Search/Invoice", reqBody);

    // API RESPONSE ERROR
    if (!response?.Success) {
      this.throwError(response?.Message, 400);
    }

    return { success: true, message: "Invoice!", response };
  };

  // POST TICKETING REQUEST
  postTicketingReq = async (req: Request) => {
    return { success: true, message: "Fare Rules" };
  };

  // SCHEDULE CHANGE
  changeSchedule = async (req: Request) => {
    const reqBody = {
      ActionType: "None",
      MFRef: "string",
      RejectOption: "None",
      FlightOptions: [
        {
          FlightNumber: 0,
          AirlineCode: "string",
          TravelDate: "string",
          DepartureTime: "string",
          CityPair: "string",
        },
      ],
      Comments: "string",
    };

    const response = await this.Req.request("POST", "/ScheduleChange", reqBody);

    // API RESPONSE ERROR
    if (!response?.Success) {
      this.throwError(response?.Message, 400);
    }

    return {
      success: true,
      message: "Change Schedule based on the UserInputs",
      response,
    };
  };

  // ACCEPT SCHEDULE CHANGE
  acceptChangeSchedule = async (req: Request) => {
    const response = await this.Req.request(
      "GET",
      "/ScheduleChangeAccept/{MFRef}/{FlightId}"
    );

    // API RESPONSE ERROR
    if (!response?.Success) {
      this.throwError(response?.Message, 400);
    }

    return {
      success: true,
      message: "Accept Schedule Change based on the UserInputs.",
      response,
    };
  };
}
