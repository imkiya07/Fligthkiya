import { Request } from "express";
import AbstractServices from "../../../../core/abstract/abstract.services";
import { IFlightCache } from "../interfaces/preBooking.interface";
import { BookingModels } from "../models/booking.models";
import { BookingRequestService } from "./bookingReq.service";
import { FareRules } from "./fareRules.service";
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
  bookingRequest = new BookingRequestService().bookingRequest;

  // ORDER TICKET
  orderTicket = async (req: Request) => {
    const bookingId = req.params.id;

    const conn = new BookingModels(this.db);

    const { booking_ref } = req.body as { booking_ref: string };

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

    await conn.updateBookingTicketStatus("ORDERED_TICKET", +bookingId);

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

  // UTILS
  getRevalidationBody = (req: Request, flight_id: string) => {
    const deviceId = req.deviceId;

    const cachedData = this.cache.get<IFlightCache>(deviceId);

    const foundItem = cachedData?.results?.find(
      (item) => item.flight_id === flight_id
    );

    if (!foundItem) {
      this.throwError("Invalid flight id", 400);
    }

    const reqBody = {
      FareSourceCode: foundItem?.fareSourceCode,
      Target: process.env.API_TARGET,
      ConversationId: "MY_SECRET",
    };

    return reqBody;
  };
}
