import { Request } from "express";
import path from "path";
import { Stripe } from "stripe";
import AbstractServices from "../../core/abstract/abstract.services";
import { EmailSend } from "../../core/common/emailSender";
import { getClassDescription } from "../B2C/postBooking/utils/postBooking.utils";
import { BookingModels } from "../B2C/preBooking/models/booking.models";
import { PreBookingService } from "../B2C/preBooking/services/preBooking.services";
import { BookingPDFService } from "../B2C/preBooking/utils/bookingReqPdfSend";
import { formatAirTravelersData } from "../B2C/preBooking/utils/preBooking.utils";
import { IBookingResponse, ICachedRevalidation } from "./payment.interface";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export class PaymentServices extends AbstractServices {
  constructor() {
    super();
  }

  preBookingServices = new PreBookingService();

  // PAYMENT INTENT OR PAYMENT REQUEST
  createPaymentIntent = async (req: Request) => {
    const user = req.user;

    const bookingId = req.params.id;

    const bookingConn = new BookingModels(this.db);

    const bookingData = await bookingConn.getBookingBodyInfo(+bookingId);

    const deviceId = req.deviceId;

    const revalidatedData = this.cache.get<any>(`revalidation-${deviceId}`);

    if (revalidatedData) {
      const airportInfo = getFirstAndLastCity(revalidatedData?.flights as any);
      const cabinClass = getClassDescription(
        revalidatedData?.flights[0]?.flightSegments[0]?.CabinClassCode
      );

      const unit_amount = +(
        (Number(revalidatedData.TotalFare.Amount) +
          Number(revalidatedData.TotalTax.Amount)) *
        100
      ).toFixed(2);

      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        success_url: `${process.env.CL_BASE_URL}/ticket/success/${bookingId}`,
        cancel_url: `${process.env.CL_BASE_URL}/ticket/cancelled/${bookingId}`,

        line_items: [
          {
            price_data: {
              currency: revalidatedData?.TotalFare.CurrencyCode,
              unit_amount,
              product_data: {
                name: `${airportInfo?.firstDepartureCity} to ${airportInfo.lastArrivalCity}  - Flight Ticket`,
                description: `${cabinClass} - Flight on ${dateFormat(
                  revalidatedData?.DepartureDateTime
                )}`,
                metadata: {
                  passenger_name: user.full_name,
                  booking_reference: bookingData?.orderNumber,
                  flight_number: revalidatedData?.flightNo,
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
          netTotal: Number(revalidatedData.TotalFare.Amount),
          baseFare: Number(revalidatedData.TotalFare.Amount),
          origin: airportInfo?.firstDepartureCity,
          destination: airportInfo.lastArrivalCity,
        },
        +bookingId
      );

      this.cache.set(`amount-set-to-${bookingId}`, {
        amount: Number(revalidatedData.TotalFare.Amount),
        currency: revalidatedData?.TotalFare.CurrencyCode,
      });

      return { success: true, url: session?.url, session };
    }
  };

  // PAYMENT SUCCESSFUL SERVICE
  paymentSuccess = async (req: Request) => {
    const bookingId = req.params.session;

    const deviceId = req.deviceId;

    const paymentSuccessCacheKey = `${deviceId}-flightBookingData-${bookingId}`;

    const paymentSuccessCachedData = this.cache.get(paymentSuccessCacheKey);

    // IF ALREADY PAYMENT SUCCESS
    if (paymentSuccessCachedData) {
      return {
        success: true,
        message: "Payment success data from cached",
        data: paymentSuccessCachedData,
      };
    }

    const bookingConn = new BookingModels(this.db);

    await bookingConn.updateBookingPaymentStatus("SUCCESS", +bookingId);

    const bookingData = await bookingConn.getBookingById(bookingId);

    if (!bookingData) throw this.throwError("Invalid booking id", 400);

    const { passengerBody, revalidation_req_body, ...restBookingData } =
      bookingData;

    if (restBookingData?.bookingStatus === "CONFIRMED") {
      return {
        success: true,
        message: "Invoice details",
        data: restBookingData,
      };
    }

    const cachedRevalidation = this.cache.get<ICachedRevalidation>(
      `revalidationOriginDesAirItinerary-${deviceId}`
    );

    if (cachedRevalidation) {
      const formatBookingBody = formatAirTravelersData(
        JSON.parse(passengerBody),
        cachedRevalidation?.OriginDestinationOptions,
        cachedRevalidation?.AirItineraryPricingInfo?.FareSourceCode
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
          pnrId: UniqueID,
          ticketStatus: "TICKET_IN_PROGRESS",
          TktTimeLimit,
          TraceId,
        },
        +bookingId
      );

      // TRIP DETAILS

      const tripDetailsResponse = await this.Req.request(
        "GET",
        `/TripDetails/${UniqueID}`
      );

      // API RESPONSE ERROR
      if (!tripDetailsResponse?.Success) {
        this.throwError(tripDetailsResponse?.Message, 400);
      }

      // FORMAT RESPONSE
      const { TravelItinerary, BookingCreatedOn } =
        tripDetailsResponse?.Data?.TripDetailsResult;
      const {
        PassengerInfos,
        TripDetailsPTC_FareBreakdowns,
        Itineraries,
        ...restItinerary
      } = TravelItinerary;

      const passengerInfos = PassengerInfos?.map((item: any) => item.Passenger);

      const [itineraries] = Itineraries?.map((item: any) => {
        return item?.ItineraryInfo?.ReservationItems;
      });

      await bookingConn.updateBookingInfo(
        {
          airline:
            itineraries[0]?.OperatingAirlineCode ||
            itineraries[0]?.MarketingAirlineCode,
          flight_no:
            itineraries[0]?.OperatingAirlineCode ||
            itineraries[0]?.MarketingAirlineCode +
              "" +
              itineraries[0]?.FlightNumber,
          departure_datetime: itineraries[0]?.DepartureDateTime,
        },
        +bookingId
      );

      const data = {
        ...restBookingData,
        ticketStatus: "TICKET_IN_PROGRESS",
        pnrId: UniqueID,
        BookingCreatedOn,
        ...restItinerary,
        itineraries,
        passengerInfos,
      };

      this.cache.set(paymentSuccessCacheKey, data);

      return {
        success: true,
        message: "Flight booking successfully",
        data,
      };
    } else {
      this.throwError(
        "The provided booking ID is invalid or the session has expired. Please contact us.",
        400
      );
    }
  };

  // PAYMENT SUCCESSFUL EMAIL SEND
  paymentSuccessMailSend = async (req: Request) => {
    const bookingId = req.params.session;

    const deviceId = req.deviceId;

    const paymentSuccessCacheKey = `${deviceId}-flightBookingData-${bookingId}`;

    const mailSendCacheKay = `${bookingId}-emailSend`;
    const alreadyMailSend = this.cache.get(mailSendCacheKay);

    if (alreadyMailSend) {
      return { success: false, message: "Mail already send" };
    }

    const bookingConn = new BookingModels(this.db);

    await bookingConn.updateBookingPaymentStatus("SUCCESS", +bookingId);

    const pdfData = this.cache.get(paymentSuccessCacheKey);

    const pdfPath = path.join(__dirname, "example.pdf");

    await BookingPDFService.generateProfessionalPDF(pdfData, pdfPath);
    await EmailSend.sendEmailWithPDF(
      pdfPath,
      req.user.email,
      "Ticket booking request"
    );

    this.cache.set(mailSendCacheKay, true);

    return {
      success: true,
      message: "Mail send successfully",
    };
  };

  paymentCancel = async (req: Request) => {
    const bookingId = req.params.session;

    const bookingConn = new BookingModels(this.db);
    await bookingConn.updateBookingPaymentStatus("CANCEL", +bookingId);
    return { success: true, message: "Payment cancel" };
  };

  appsPaymentIntent = async (req: Request) => {
    const user = req.user;

    const bookingId = req.params.id;

    const bookingConn = new BookingModels(this.db);

    const bookingData = await bookingConn.getBookingBodyInfo(+bookingId);

    const deviceId = req.deviceId;

    const revalidatedData = this.cache.get<any>(`revalidation-${deviceId}`);

    if (revalidatedData) {
      const airportInfo = getFirstAndLastCity(revalidatedData?.flights as any);
      const cabinClass = getClassDescription(
        revalidatedData?.flights[0]?.flightSegments[0]?.CabinClassCode
      );

      const unit_amount = +(
        (Number(revalidatedData.TotalFare.Amount) +
          Number(revalidatedData.TotalTax.Amount)) *
        100
      ).toFixed(2);

      // ============ STRIPE =============== //
      const customer = await stripe.customers.create({
        name: user.full_name,
        email: user.email, // Include user email if available
        metadata: {
          booking_reference: "FL0001212",
        },
      });

      const ephemeralKey = await stripe.ephemeralKeys.create(
        { customer: customer.id },
        { apiVersion: "2022-11-15" }
      );

      const paymentIntent = await stripe.paymentIntents.create({
        amount: unit_amount,
        currency: revalidatedData?.TotalFare.CurrencyCode,
        customer: customer.id,
        metadata: {
          passenger_name: user.full_name,
          booking_reference: bookingData?.orderNumber,
          flight_number: revalidatedData?.flightNo,
          departure_airport: airportInfo?.departure_airport,
          arrival_airport: airportInfo?.arrival_airport,
        },
      });

      return {
        success: true,
        paymentIntent: paymentIntent.client_secret,
        ephemeralKey: ephemeralKey.secret,
        customer: customer.id,
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
      };
    } else {
      return {
        success: false,
        message:
          "Revalidation or booking request is required or session expired",
      };
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

const dateFormat = (dateString: string) => {
  const date = new Date(dateString);

  // Define ordinal suffix function
  const getOrdinal = (n: number) => {
    const s = ["th", "st", "nd", "rd"],
      v = n % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
  };

  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "short" });
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const period = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12; // Convert 0-23 to 12-hour format

  const formattedDate = `${day}${getOrdinal(
    day
  )} ${month} ${year} at ${formattedHours}:${minutes} ${period}`;

  return formattedDate;
};
