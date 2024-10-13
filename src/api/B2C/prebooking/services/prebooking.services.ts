import { Request } from "express";
import AbstractServices from "../../../../utils/abstracts/abstract.services";
import { FareRules } from "./fareRules.service";
import { FlightBookService } from "./flightBook.service";
import { FlightSearchService } from "./flightSearch.service";
import { Revalidation } from "./revalidation.service";

export class PrebookingService extends AbstractServices {
  constructor() {
    super();
  }

  // NARROW SERVICES
  flightSearch = new FlightSearchService().flightSearch;
  revalidated = new Revalidation().revalidated;
  fareRules = new FareRules().fareRules;
  flightBook = new FlightBookService().flightBook;

  // ORDER TICKET
  orderTicket = async (req: Request) => {
    const { uniqu_id } = req.query;

    if (!uniqu_id) {
      this.throwError("Unique id missing", 400);
    }

    const reqBody = {
      UniqueID: uniqu_id,
      Target: "Test",
    };

    const response = await this.Req.postRequest("/v1/OrderTicket", reqBody);

    // API RESPONSE ERROR
    if (!response?.Success) {
      this.throwError(response?.Message, 400);
    }

    return { success: true, message: "Order ticket", data: response };
  };


  // TRIP/FLIGHT DETAILS
  tripDetails = async (req: Request) => {
    const { booking_ref } = req.query;

    if (!booking_ref) {
      this.throwError("Booking reference is missing", 400);
    }

    const reqBody = {   
      "BookingRef": booking_ref
    } ;

    const response = await this.Req.postRequest("/v1/OrderTicket", reqBody);

    // API RESPONSE ERROR
    if (!response?.Success) {
      this.throwError(response?.Message, 400);
    }

    return { success: true, message: "Order ticket", data: response };
  };
}
