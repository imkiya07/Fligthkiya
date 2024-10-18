import { Request } from "express";
import AbstractServices from "../../../../core/abstract/abstract.services";
import { FareRules } from "./fareRules.service";
import { FlightBookService } from "./flightBook.service";
import { FlightSearchService } from "./flightSearch.service";
import { Revalidation } from "./revalidation.service";

export class PreBookingService extends AbstractServices {
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
    const { booking_ref } = req.params;

    if (!booking_ref) {
      this.throwError("Booking reference is missing", 400);
    }

    const reqBody = {
      UniqueID: booking_ref,
      Target: process.env.API_TARGET,
    };

    const response = await this.Req.request("POST", "/v1/OrderTicket", reqBody);

    // API RESPONSE ERROR
    if (!response?.Success) {
      this.throwError(response?.Message, 400);
    }

    return {
      success: true,
      message: "Order ticket successfully!",
      data: response?.Data,
    };
  };

  // TRIP/FLIGHT DETAILS
  tripDetails = async (req: Request) => {
    const { booking_ref } = req.params;

    if (!booking_ref) {
      this.throwError("Booking reference is missing", 400);
    }

    const response = await this.Req.request(
      "GET",
      `/TripDetails/${booking_ref}`
    );

    // API RESPONSE ERROR
    if (!response?.Success) {
      this.throwError(response?.Message, 400);
    }

    // FORMAT RESPONSE
    const { TravelItinerary, BookingCreatedOn } =
      response?.Data?.TripDetailsResult;
    const {
      PassengerInfos,
      TripDetailsPTC_FareBreakdowns,
      Itineraries,
      ...restItinerary
    } = TravelItinerary;

    const passengerInfos = PassengerInfos?.map((item: any) => item.Passenger);

    const fareBreakdowns = TripDetailsPTC_FareBreakdowns?.map((item: any) => {
      const { EquiFare, Tax, TotalFare, AirportTaxBreakUp } =
        item?.TripDetailsPassengerFare;
      return {
        passengerType: item?.PassengerTypeQuantity?.Code,
        passengerQuantity: item?.PassengerTypeQuantity?.Quantity,
        EquiFare,
        Tax,
        TotalFare,
        AirportTaxBreakUp,
        BaggageInfo: item?.BaggageInfo,
        CabinBaggageInfo: item?.CabinBaggageInfo,
        IsPenaltyDetailsAvailable: item?.IsPenaltyDetailsAvailable,
        AirRefundCharges: item?.AirRefundCharges,
        AirExchangeCharges: item?.AirExchangeCharges,
        AirVoidCharges: item?.AirVoidCharges,
      };
    });

    const [itineraries] = Itineraries?.map((item: any) => {
      return item?.ItineraryInfo?.ReservationItems;
    });

    return {
      success: true,
      message: "Trip details",
      data: {
        BookingCreatedOn,
        ...restItinerary,
        itineraries,
        passengerInfos,
        fareBreakdowns,
      },
    };
  };

  // SEAT MAP SEARCH
  seatMap = async (req: Request) => {
    const sessionId = req.get("sessionid") as string;

    const revalidationItem = this.cache.get<{ FareSourceCode: string }>(
      `revalidation-${sessionId}`
    );

    if (!revalidationItem) {
      this.throwError("Revalidation is required!", 400);
    }

    const reqBody = {
      FareSourceCode: revalidationItem?.FareSourceCode,
      Target: process.env.API_TARGET || "Test",
      ConversationId: "MY_SECRET",
    };

    const response = await this.Req.request(
      "POST",
      "/v1/SeatMap/Flight",
      reqBody
    );

    // API RESPONSE ERROR
    if (!response?.Success) {
      this.throwError(response?.Message, 400);
    }

    return {
      success: true,
      message: "Flight Seat Map Search",
      response,
    };
  };
}
