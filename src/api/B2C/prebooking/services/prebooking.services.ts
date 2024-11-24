import { Request } from "express";
import AbstractServices from "../../../../core/abstract/abstract.services";
import { IBookingReqBody } from "../interfaces/bookingReqBody.interface";
import { IFlightCache } from "../interfaces/preBooking.interface";
import { IRevalidateRes } from "../interfaces/revalidateRes.interface";
import { BookingModels } from "../models/booking.models";
import { formatAirTravelersData } from "../utils/preBooking.utils";
import { FareRules } from "./fareRules.service";
import { FlightBookService } from "./flightBook.service";
import { FlightSearchService } from "./flightSearch.service";
import { Revalidation } from "./revalidation.service";
import { UserCreateWithTempPass } from "./userCreateTempPass.service";

export class PreBookingService extends AbstractServices {
  constructor() {
    super();
  }

  // NARROW SERVICES
  flightSearch = new FlightSearchService().flightSearch;
  revalidated = new Revalidation().revalidated;
  fareRules = new FareRules().fareRules;
  flightBook = new FlightBookService().flightBook;

  // BOOKING REQUEST
  bookingRequest = async (req: Request) => {
    const body = req.body as IBookingReqBody;
    const conn = new BookingModels(this.db);
    const deviceId = req.deviceId;

    const createUser = new UserCreateWithTempPass();
    const { token, user_id } = await createUser.createUserAndSendEmail(body);

    const revalidateReqBody = this.cache.get(`revalidateReqBody-${deviceId}`);

    if (!revalidateReqBody) {
      this.throwError("Revalidation is required!", 400);
    }

    const orderNumber = generateOrderNumber();

    const bookingReqPayload = {
      user_id,
      orderNumber,
      CountryCode: body?.CountryCode,
      AreaCode: body?.AreaCode,
      PhoneNumber: body?.PhoneNumber,
      Email: body?.Email,
      PostCode: body?.PostCode,
      revalidation_req_body: JSON.stringify(revalidateReqBody),
      passengerBody: JSON.stringify(body),
      status: "BOOKING_REQUEST",
    };

    const booking_id = await conn.insertBookingInfo(bookingReqPayload);

    const passengerData = body?.AirTravelers?.map((item) => {
      return {
        user_id,
        booking_id,
        PassengerType: item.PassengerType,
        Gender: item.Gender,
        DateOfBirth: item.DateOfBirth,
        NationalID: item.NationalID,
        PassengerNationality: item.PassengerNationality,
        PassengerTitle: item.PassengerName.PassengerTitle,
        PassengerFirstName: item.PassengerName.PassengerFirstName,
        PassengerLastName: item.PassengerName.PassengerLastName,
        PassportNumber: item?.Passport?.PassportNumber,
        ExpiryDate: item?.Passport?.ExpiryDate,
        Country: item?.Passport?.Country,
      };
    });

    await conn.insertAirTravelers(passengerData);

    return {
      success: true,
      message: "Temporary booking successfully",
      data: {
        user_id,
        booking_id,
        orderNumber,
        token,
      },
    };
  };

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

const getFirstAndLastCity = (
  flights: {
    flightSegments: {
      departureCity: string;
      arrivalCity: string;
      departureAirport: string;
      arrivalAirport: string;
      FlightNumber: string;
      MarketingAirlineCode: string;
    }[];
  }[]
) => {
  const firstDepartureCity = flights[0]?.flightSegments[0]?.departureCity;
  const departure_airport = flights[0]?.flightSegments[0]?.departureAirport;
  const flight_number =
    flights[0]?.flightSegments[0]?.MarketingAirlineCode +
    "" +
    flights[0]?.flightSegments[0]?.FlightNumber;

  // Last flight's last arrivalCity
  const lastFlightSegments = flights[flights.length - 1]?.flightSegments;

  const lastArrivalCity =
    lastFlightSegments?.[lastFlightSegments.length - 1]?.arrivalCity;
  const arrival_airport =
    lastFlightSegments?.[lastFlightSegments.length - 1]?.arrivalAirport;

  return {
    firstDepartureCity,
    lastArrivalCity,
    departure_airport,
    arrival_airport,
  };
};

function generateOrderNumber() {
  const prefix = "ORD";
  const timestamp = Date.now(); // Current timestamp in milliseconds

  return `${prefix}-${timestamp}`;
}
