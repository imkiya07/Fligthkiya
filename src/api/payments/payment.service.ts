import { Request } from "express";
import { Stripe } from "stripe";
import AbstractServices from "../../core/abstract/abstract.services";
import { PassengerInfo } from "./payment.interface";
import { getClassDescription } from "../B2C/postBooking/utils/postBooking.utils";

export class PaymentServices extends AbstractServices {
  constructor() {
    super();
  }

  createPaymentIntent = async (req: Request) => {
    const body = req.body as PassengerInfo[];

    const deviceId = req.deviceId;

    const revalidationItem = this.cache.get<any>(`revalidation-${deviceId}`);

    if (!revalidationItem) {
      this.throwError("Revalidation is required!", 400);
    }

    console.log({ revalidationItem, deviceId });

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
