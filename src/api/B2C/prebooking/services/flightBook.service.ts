import { Request } from "express";
import AbstractServices from "../../../../utils/abstracts/abstract.services";
import { IFlightCache, IFlightSegment } from "../interfaces/flight.interface";

export class FlightBookService extends AbstractServices {
  constructor() {
    super();
  }

  // FLIGHT SEARCH
  async flightBook(req: Request) {
    const sessionId = req.get("sessionid") as string;

    const cachedData = this.cache.get<IFlightCache>(sessionId);

    const flight_id = req.body.flight_id;

    const foundItem = cachedData?.results?.find(
      (item) => item.flight_id === flight_id
    );

    const revalidationItem = this.cache.get<{ FareSourceCode: string }>(
      `revalidation-${sessionId}`
    );

    if (!foundItem) {
      this.throwError("Invalid session id or flight id", 400);
    }

    if (!revalidationItem) {
      this.throwError("Revalidation is required!", 400);
    }

    // REQUEST BODY FORMATTER
    const RequestedSegments = foundItem?.segments?.map(
      (item: IFlightSegment) => {
        return {
          Origin: item.DepartureAirportLocationCode,
          Destination: item.ArrivalAirportLocationCode,
          FlightNumber:
            item.OperatingCarrierCode + "" + item.OperatingFlightNumber,
          DepartureDateTime: item.DepartureDateTime,
          RequestSSRs: [
            {
              SSRCode: "Any",
              FreeText: "Meal MOML",
            },
          ],
        };
      }
    );

    const {
      airTravelers,
      CountryCode,
      AreaCode,
      PhoneNumber,
      Email,
      PostCode,
    } = req.body;

    const AirTravelers = airTravelers?.map((item: any) => {
      return {
        ...item,
        SpecialServiceRequest: {
          SeatPreference: "Any",
          MealPreference: "Any",
          RequestedSegments,
        },
      };
    });

    const reqBody = {
      FareSourceCode: revalidationItem?.FareSourceCode,
      TravelerInfo: {
        AirTravelers,
        CountryCode,
        AreaCode,
        PhoneNumber,
        Email,
        PostCode,
      },
      Target: "Test",
    };

    const response = await this.Req.request("POST", "/v1/Book/Flight", reqBody);

    // API RESPONSE ERROR
    if (!response?.Success) {
      this.throwError(response?.Message, 400);
    }

    // FORMATTER

    return {
      success: true,
      message: "Flight book successfully",
      data: response?.Data,
    };
  }
}
