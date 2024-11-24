import { Request } from "express";
import { Stripe } from "stripe";
import AbstractServices from "../../core/abstract/abstract.services";
import { getClassDescription } from "../B2C/postBooking/utils/postBooking.utils";
import { IRevalidateRes } from "../B2C/preBooking/interfaces/revalidateRes.interface";
import { BookingModels } from "../B2C/preBooking/models/booking.models";
import { PreBookingModels } from "../B2C/preBooking/models/preBooking.models";
import { PreBookingService } from "../B2C/preBooking/services/preBooking.services";
import {
  formatAirTravelersData,
  formatRevalidation,
} from "../B2C/preBooking/utils/preBooking.utils";
import { IBookingResponse } from "./payment.interface";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export class PaymentServices extends AbstractServices {
  constructor() {
    super();
  }

  preBookingServices = new PreBookingService();

  // PAYMENT INTENT OR PAYMENT REQUEST
  createPaymentIntent = async (req: Request) => {
    const bookingId = req.params.id;

    const conn = new PreBookingModels(this.db);
    const bookingConn = new BookingModels(this.db);

    const { revalidation_req_body } = await bookingConn.getBookingBodyInfo(
      +bookingId
    );

    const response = (await this.Req.request(
      "POST",
      "/v1/Revalidate/Flight",
      revalidation_req_body
    )) as IRevalidateRes;

    const formattedData = await formatRevalidation(response?.Data, conn);

    if (response.Success && formattedData) {
      const airportInfo = getFirstAndLastCity(formattedData?.flights as any);
      const cabinClass = getClassDescription(
        formattedData?.flights[0]?.flightSegments[0]?.CabinClassCode
      );

      const unit_amount = +(
        Number(formattedData.TotalFare.Amount) * 100
      ).toFixed(2);

      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        success_url: `${process.env.CL_BASE_URL}/pay/success/${bookingId}`,
        cancel_url: `${process.env.CL_BASE_URL}/pay/cancel/${bookingId}`,

        line_items: [
          {
            price_data: {
              currency: formattedData?.TotalFare.CurrencyCode,
              unit_amount,
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

      await bookingConn.updateBookingPayment(
        {
          netTotal: Number(formattedData.TotalFare.Amount),
          baseFare: Number(formattedData.TotalFare.Amount),
        },
        +bookingId
      );

      return { success: true, url: session?.url };
    }
  };

  paymentSuccess = async (req: Request) => {
    const bookingId = req.params.session;

    const bookingConn = new BookingModels(this.db);
    await bookingConn.updateBookingPaymentStatus("SUCCESS", +bookingId);

    const { passengerBody, revalidation_req_body } =
      await bookingConn.getBookingBodyInfo(+bookingId);

    const revalidationResponse = (await this.Req.request(
      "POST",
      "/v1/Revalidate/Flight",
      revalidation_req_body
    )) as IRevalidateRes;

    if (!revalidationResponse?.Success) {
      await bookingConn.updateBookingBookingStatus("FAILED", +bookingId);
      throw this.throwError(revalidationResponse?.Message, 400);
    }

    const { OriginDestinationOptions, AirItineraryPricingInfo } =
      revalidationResponse?.Data?.PricedItineraries[0];

    const formatBookingBody = formatAirTravelersData(
      passengerBody,
      OriginDestinationOptions,
      AirItineraryPricingInfo?.FareSourceCode
    );

    const response = (await this.Req.request(
      "POST",
      "/v1/Book/Flight",
      formatBookingBody
    )) as IBookingResponse;

    // API RESPONSE ERROR
    if (!response?.Success) {
      this.throwError(response?.Message, 400);
    }

    const { TktTimeLimit, UniqueID, TraceId } = response?.Data;

    await bookingConn.updateBookingConfirm(
      {
        bookingStatus: "CONFIRMED",
        pnrId: UniqueID,
        ticketStatus: "BOOKED",
        TktTimeLimit,
        TraceId,
      },
      +bookingId
    );

    return {
      success: true,
      message: "Flight booking successfully",
      data: response?.Data,
    };
  };

  paymentCancel = async (req: Request) => {
    const bookingId = req.params.session;

    const bookingConn = new BookingModels(this.db);
    await bookingConn.updateBookingPaymentStatus("CANCEL", +bookingId);
    return { success: true, message: "Payment cancel" };
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
