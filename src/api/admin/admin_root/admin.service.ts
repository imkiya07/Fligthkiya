import { Request } from "express";
import AbstractServices from "../../../core/abstract/abstract.services";

export class AdminServices extends AbstractServices {
  constructor() {
    super();
  }

  /**
   * @CancelBooking
   */
  cancelBooking = async (req: Request) => {
    const pnrId = req.params.pnrId;

    const payload = {
      UniqueID: pnrId,
      Target: process.env.API_TARGET,
      ConversationId: "string",
    };

    const response = await this.Req.request(
      "POST",
      "/v1/api/v1/Booking/Cancel",
      payload
    );

    return {
      success: true,
      message: "Booking cancel successfully",
      response,
    };
  };

  /**
   * @SearchInvoice
   */
  searchInvoice = async (req: Request) => {
    return {
      success: true,
      message: "Admin created successfully",
    };
  };

  /**
   * @ScheduleChange
   */
  scheduleChange = async (req: Request) => {
    return {
      success: true,
      message: "Admin created successfully",
    };
  };

  /**
   * @voidRequest
   */
  voidRequest = async (req: Request) => {
    return {
      success: true,
      message: "Admin created successfully",
    };
  };

  /**
   * @voidRequestQuote
   */
  voidRequestQuote = async (req: Request) => {
    return {
      success: true,
      message: "Admin created successfully",
    };
  };

  /**
   * @reissueRequest
   */
  reissueRequest = async (req: Request) => {
    const payload = {
      ptrType: "ReissueQuote",
      mFRef: "MF15170620",
      AllowChildPassenger: true,
      reissueQuoteRequestType: "Segment",
      passengers: [
        {
          firstName: "Alex",
          lastName: "Tan",
          title: "MR",
          eTicket: "1234580095753",
          passengerType: "ADT",
        },
      ],
      originDestinations: [
        {
          originLocationCode: "JFK",
          destinationLocationCode: "IST",
          cabinPreference: "Y",
          departureDateTime: "2020-10-15",
          flightNumber: 12,
          airlineCode: "TK",
        },
        {
          originLocationCode: "IST",
          destinationLocationCode: "LHR",
          cabinPreference: "Y",
          departureDateTime: "2020-10-16",
          flightNumber: 1979,
          airlineCode: "TK",
        },
      ],
    };

    const response = await this.Req.request("POST", "/api/Refund", payload);

    return {
      success: true,
      message: "Admin created successfully",
    };
  };

  /**
   * @reissueRequestQuote
   */
  reissueRequestQuote = async (req: Request) => {
    return {
      success: true,
      message: "Admin created successfully",
    };
  };

  /**
   * @refundRequest
   */
  refundRequest = async (req: Request) => {
    const payload = {
      ptrType: "Refund",
      mFRef: "MF15171620",
      passengers: [
        {
          firstName: "Alex",
          lastName: "Tan",
          title: "Miss",
          eTicket: "3673876689999",
          passengerType: "ADT",
        },
      ],
      AdditionalNote: "Proceed direct Cancellation as per penalty",
    };
    const response = await this.Req.request("POST", "/api/Refund", payload);
    return {
      success: true,
      message: "Admin created successfully",
    };
  };

  /**
   * @refundRequestQuote
   */
  refundRequestQuote = async (req: Request) => {
    const payload = {
      ptrType: "Refund",
      mFRef: "MF15171620",
      passengers: [
        {
          firstName: "Alex",
          lastName: "Tan",
          title: "Miss",
          eTicket: "3673876689999",
          passengerType: "ADT",
        },
      ],
      AdditionalNote: "Proceed direct Cancellation as per penalty",
    };
    const response = await this.Req.request("POST", "/api/Refund", payload);
    return {
      success: true,
      message: "Admin created successfully",
    };
  };
}
