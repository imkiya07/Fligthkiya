import { Request } from "express";
import AbstractServices from "../../../../core/abstract/abstract.services";
import db from "../../../../core/database/db";
import { IFlightCache } from "../interfaces/preBooking.interface";
import { PreBookingModels } from "../models/preBooking.models";
import { formatRevalidation } from "../utils/preBooking.utils";

export class Revalidation extends AbstractServices {
  constructor() {
    super();
  }

  // FLIGHT SEARCH
  async revalidated(req: Request) {
    const conn = new PreBookingModels(db);

    const deviceId = req.deviceId;

    const cachedData = this.cache.get<IFlightCache>(deviceId);

    const flight_id = req.params.flight_id;

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

    const response = await this.Req.request(
      "POST",
      "/v1/Revalidate/Flight",
      reqBody
    );

    // API RESPONSE ERROR
    if (!response?.Success) {
      this.throwError(response?.Message, 400);
    }

    const formattedData = (await formatRevalidation(
      response?.Data,
      conn
    )) as any;

    const revalidationResponse = {
      airline: foundItem?.airline,
      airline_name: foundItem?.airline_name,
      airline_img: foundItem?.airline_img,
      departureAirportCode: foundItem?.departureAirportCode,
      departureAirportName: foundItem?.departureAirportName,
      arrivalAirportCode: foundItem?.arrivalAirportCode,
      arrivalAirportName: foundItem?.arrivalAirportName,
      DepartureDateTime: foundItem?.DepartureDateTime,
      ArrivalDateTime: foundItem?.ArrivalDateTime,
      flightNo: foundItem?.flightNo,
      ...formattedData,
    };

    this.cache.set(`revalidateReqBody-${deviceId}`, reqBody);

    this.cache.set(`revalidation-${deviceId}`, revalidationResponse);

    if (!response?.Data?.PricedItineraries) {
      throw this.throwError("Revalidation failed. Please try again.", 400);
    }

    const itineraryData = response?.Data?.PricedItineraries[0];

    if (
      itineraryData?.OriginDestinationOptions &&
      itineraryData?.AirItineraryPricingInfo
    ) {
      this.cache.set(
        `revalidationOriginDesAirItinerary-${deviceId}`,
        {
          OriginDestinationOptions: itineraryData?.OriginDestinationOptions,
          AirItineraryPricingInfo: itineraryData?.AirItineraryPricingInfo,
        },
        "45m"
      );

      const { FareSourceCode, ...data } = revalidationResponse;

      return {
        success: true,
        message: "Flight revalidation",
        data,
      };
    } else {
      throw this.throwError("Revalidation failed. Please try again.", 400);
    }
  }
}
