import { Request } from "express";
import { Stripe } from "stripe";
import AbstractServices from "../../core/abstract/abstract.services";

export class PaymentServices extends AbstractServices {
  constructor() {
    super();
  }

  createPaymentIntent = async (req: Request) => {
    const stripe = new Stripe(
      "sk_test_51JyCktCw0Qr73TDTfCQ5UEpX4yeQwdn09fVhOfaRNGDmEKrjPAZDdt0vENe3wGbZixMmnjieuzD3feiVdfPHKUnc00lMoOoKXL"
    );

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: `${process.env.CL_BASE_URL}/success`,
      cancel_url: `${process.env.CL_BASE_URL}/cancel`,

      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: 50 * 100,
            product_data: {
              name: "Dhaka to New York - Flight Ticket",
              description:
                "Economy Class - Flight on 25th Dec 2024, Departure at 10:30 AM",
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
  };
}
