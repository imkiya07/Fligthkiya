import { Request } from "express";
import Stripe from "stripe";
import AbstractServices from "../../../../core/abstract/abstract.services";
import { getClassDescription } from "../../postBooking/utils/postBooking.utils";
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

  // PAYMENT INTENT
  getPaymentIntent = async (req: Request) => {
    const deviceId = req.deviceId;

    const revalidationItem = this.cache.get<any>(`revalidation-${deviceId}`);

    if (!revalidationItem) {
      this.throwError("Revalidation is required!", 400);
    }

    if (revalidationItem) {
      const stripe = new Stripe(
        "sk_test_51JyCktCw0Qr73TDTfCQ5UEpX4yeQwdn09fVhOfaRNGDmEKrjPAZDdt0vENe3wGbZixMmnjieuzD3feiVdfPHKUnc00lMoOoKXL"
      );

      const airportInfo = getFirstAndLastCity(revalidationItem?.flights as any);
      const cabinClass = getClassDescription(
        revalidationItem?.flights[0]?.flightSegments[0]?.CabinClassCode
      );

      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        success_url: `${process.env.CL_BASE_URL}/success`,
        cancel_url: `${process.env.CL_BASE_URL}/cancel`,

        line_items: [
          {
            price_data: {
              currency: revalidationItem?.TotalFare.CurrencyCode,
              unit_amount: Number(revalidationItem.TotalFare.Amount) * 100,
              product_data: {
                name: `${airportInfo?.firstDepartureCity} to ${airportInfo.lastArrivalCity}  - Flight Ticket`,
                description: `${cabinClass} - Flight on 3rd Feb 2025, Departure at 10:00 AM`,
                metadata: {
                  passenger_name: "John Doe",
                  booking_reference: "AB1234CD",
                  ticket_number: "TK5678",
                  flight_number: "NY123",
                  departure_airport: airportInfo?.departure_airport,
                  arrival_airport: airportInfo?.arrival_airport,
                },
                images: [
                  "https://www.botomul.com/storage/files/bd/6/thumb-816x460-2d2294c943e212b69f0ff369cafa4810.png",
                ],
              },
            },
            quantity: 1,
          },
        ],
      });

      return { success: true, url: session?.url };
    }
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
