import nodemailer from "nodemailer";

import { Request } from "express";
import { Stripe } from "stripe";
import AbstractServices from "../../core/abstract/abstract.services";
import { getClassDescription } from "../B2C/postBooking/utils/postBooking.utils";
import { BookingModels } from "../B2C/preBooking/models/booking.models";
import { PreBookingModels } from "../B2C/preBooking/models/preBooking.models";
import { PreBookingService } from "../B2C/preBooking/services/preBooking.services";
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

    const conn = new PreBookingModels(this.db);
    const bookingConn = new BookingModels(this.db);

    const bookingData = await bookingConn.getBookingBodyInfo(+bookingId);

    // if (!bookingData) throw this.throwError("Invalid booking id", 400);

    // const revalidationResponse = (await this.Req.request(
    //   "POST",
    //   "/v1/Revalidate/Flight",
    //   bookingData?.revalidation_req_body
    // )) as IRevalidateRes;

    // const formattedData = await formatRevalidation(
    //   revalidationResponse?.Data,
    //   conn
    // );

    const deviceId = req.deviceId;

    const formattedData = this.cache.get<any>(`revalidation-${deviceId}`);

    // if (revalidationResponse.Success && formattedData) {
    if (formattedData) {
      const airportInfo = getFirstAndLastCity(formattedData?.flights as any);
      const cabinClass = getClassDescription(
        formattedData?.flights[0]?.flightSegments[0]?.CabinClassCode
      );

      const unit_amount = +(
        Number(formattedData.TotalFare.Amount) * 100
      ).toFixed(2);

      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        success_url: `${process.env.CL_BASE_URL}/ticket/success/${bookingId}`,
        cancel_url: `${process.env.CL_BASE_URL}/ticket/cancelled/${bookingId}`,

        line_items: [
          {
            price_data: {
              currency: formattedData?.TotalFare.CurrencyCode,
              unit_amount,
              product_data: {
                name: `${airportInfo?.firstDepartureCity} to ${airportInfo.lastArrivalCity}  - Flight Ticket`,
                description: `${cabinClass} - Flight on ${dateFormat(
                  formattedData?.DepartureDateTime
                )}`,
                metadata: {
                  passenger_name: user.full_name,
                  booking_reference: bookingData?.orderNumber,
                  flight_number: formattedData?.flightNo,
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
          origin: airportInfo?.firstDepartureCity,
          destination: airportInfo.lastArrivalCity,
        },
        +bookingId
      );

      this.cache.set(`amount-set-to-${bookingId}`, {
        amount: formattedData.TotalFare.Amount,
        currency: formattedData?.TotalFare.CurrencyCode,
      });

      // const { OriginDestinationOptions, AirItineraryPricingInfo } =
      //   revalidationResponse?.Data?.PricedItineraries[0];

      // this.cache.set(`revalidationOriginDesAirItinerary-${bookingId}`, {
      //   OriginDestinationOptions,
      //   AirItineraryPricingInfo,
      // });

      return { success: true, url: session?.url };
    }
  };

  // PAYMENT SUCCESSFUL SERVICE
  paymentSuccess = async (req: Request) => {
    const bookingId = req.params.session;

    const deviceId = req.deviceId;

    const bookingConn = new BookingModels(this.db);

    await bookingConn.updateBookingPaymentStatus("SUCCESS", +bookingId);

    const bookingData = await bookingConn.getBookingById(bookingId);

    if (!bookingData) throw this.throwError("Invalid booking id", 400);

    const { passengerBody, revalidation_req_body, ...data } = bookingData;

    if (data?.bookingStatus === "CONFIRMED") {
      return { success: true, message: "Invoice details", data };
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
          bookingStatus: "CONFIRMED",
          pnrId: UniqueID,
          ticketStatus: "BOOKED",
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

      return {
        success: true,
        message: "Flight booking successfully",
        data: {
          ...data,
          pnrId: UniqueID,
          BookingCreatedOn,
          ...restItinerary,
          itineraries,
          passengerInfos,
        },
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

    const bookingConn = new BookingModels(this.db);

    await bookingConn.updateBookingPaymentStatus("SUCCESS", +bookingId);

    const bookingData = await bookingConn.getBookingById(bookingId);

    if (!bookingData) throw this.throwError("Invalid booking id", 400);

    const cachedData = this.cache.get<any>(`amount-set-to-${bookingId}`);

    // mail send
    const transporter = nodemailer.createTransport({
      service: "Gmail", // Or another SMTP service
      auth: {
        user: process.env.EMAIL_SEND_EMAIL_ID,
        pass: process.env.EMAIL_SEND_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_SEND_EMAIL_ID, //"your-email@gmail.com",
      to: req?.user?.email,
      subject: "Flight Kiya Booking Confirmed",
      html: getPaymentConfirmTemplate(
        req?.user?.full_name,
        bookingData?.orderNumber,
        bookingData?.pnrId,
        `${bookingData?.origin} to ${bookingData?.destination}`,
        bookingData?.departure_datetime,
        cachedData?.currency,
        cachedData?.amount
      ),
    };

    await transporter.sendMail(mailOptions);

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

const getPaymentConfirmTemplate = (
  full_name: string,
  bookingId: string,
  pnr: string,
  route: string,
  departureDate: string,
  currency: string,
  amount: number
) => {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Payment Confirmation</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f6f6f6;
        color: #333;
      }
      .email-container {
        max-width: 600px;
        margin: 20px auto;
        background-color: #fff;
        border: 1px solid #ddd;
        border-radius: 8px;
        overflow: hidden;
      }
      .header {
        background-color: #28a745;
        text-align: center;
        padding: 20px;
      }
      .header img {
        max-width: 100px;
        margin-bottom: 10px;
      }
      .header h1 {
        color: #fff;
        font-size: 24px;
        margin: 0;
      }
      .content {
        padding: 20px;
      }
      .content h2 {
        color: #333;
        font-size: 20px;
        margin-top: 0;
      }
      .content p {
        margin: 10px 0;
        line-height: 1.5;
      }
      .button {
        text-align: center;
        margin: 20px 0;
      }
      .button a {
        background-color: #28a745;
        color: #fff;
        text-decoration: none;
        padding: 10px 20px;
        border-radius: 5px;
        font-size: 16px;
      }
      .footer {
        background-color: #f6f6f6;
        text-align: center;
        padding: 10px;
        font-size: 12px;
        color: #999;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="header">
        <img
          src="https://i.ibb.co.com/XCb5P7Z/flightkiya.jpg"
          alt="Flight Kiya Logo"
        />
        <h1>Flight Kiya</h1>
      </div>
      <div class="content">
        <h2>Thank you for your payment!</h2>
        <p>Dear ${full_name},</p>
        <p>
          We have successfully received your payment for the following booking:
        </p>
        <p>
          Booking ID: <strong>${bookingId}</strong><br />
          PNR: <strong>${pnr}</strong><br />
          Route: <strong>${route}</strong><br />
          Flight Date: <strong>${departureDate}</strong>
        </p>
        <p>The total amount paid: <strong>${currency} ${amount}</strong></p>
        <p>
          Your flight ticket has been confirmed. You can now download your
          ticket using the link below.
        </p>
        <div class="button">
          <a href="https://example.com/download-ticket" target="_blank"
            >Download Ticket</a
          >
        </div>
        <p>
          If you need assistance, please contact us by calling at
          <strong>+880-9557-111-888</strong> or sending mail to
          <a href="mailto:info@flightkiya.com">info@flightkiya.com</a>.
        </p>
      </div>
      <div class="footer">
        <p>&copy; 2024 Flight Kiya. All rights reserved.</p>
        <p>901 Motijheel City Centre, Level 25-D-1, Dhaka 1000, Bangladesh</p>
      </div>
    </div>
  </body>
</html>
`;
};
