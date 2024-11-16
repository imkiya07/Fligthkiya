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

    const revalidationItem = this.cache.get<{
      flights: {
        flightSegments: {
          departureCity: string;
          arrivalCity: string;
          CabinClassCode: string;
          ArrivalDateTime: string; //"ArrivalDateTime": "2025-02-03T07:35:00",
          DepartureDateTime: string; //"DepartureDateTime": "2025-02-03T02:10:00",
        }[];
      }[];
      TotalFare: {
        Amount: string;
        CurrencyCode: string;
        DecimalPlaces: number;
      };
    }>(`revalidation-${deviceId}`);

    if (revalidationItem) {
      const stripe = new Stripe(
        "sk_test_51JyCktCw0Qr73TDTfCQ5UEpX4yeQwdn09fVhOfaRNGDmEKrjPAZDdt0vENe3wGbZixMmnjieuzD3feiVdfPHKUnc00lMoOoKXL"
      );

      const cityName = getFirstAndLastCity(revalidationItem?.flights);
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
                name: `${cityName?.firstDepartureCity} to ${cityName.lastArrivalCity}  - Flight Ticket`,
                description: `${cabinClass} - Flight on 25th Dec 2024, Departure at 10:30 AM`,
                metadata: {
                  passenger_name: "John Doe",
                  booking_reference: "AB1234CD",
                  ticket_number: "TK5678",
                  flight_number: "NY123",
                  departure_airport: "Hazrat Shahjalal International Airport",
                  arrival_airport: "John F. Kennedy International Airport",
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
    } else {
      this.throwError("Revalidation is required!", 400);
    }
  };
}

const getFirstAndLastCity = (
  flights: {
    flightSegments: { departureCity: string; arrivalCity: string }[];
  }[]
) => {
  const firstDepartureCity = flights[0]?.flightSegments[0]?.departureCity;

  // Last flight's last arrivalCity
  const lastFlightSegments = flights[flights.length - 1]?.flightSegments;
  const lastArrivalCity =
    lastFlightSegments?.[lastFlightSegments.length - 1]?.arrivalCity;

  return { firstDepartureCity, lastArrivalCity };
};
