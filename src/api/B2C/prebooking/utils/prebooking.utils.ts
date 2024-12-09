import { v4 as uuidv4 } from "uuid";
import { IFormattedRevalidation } from "../interfaces/formattedRevalidation.interface";
import { IAirTravelersRequest } from "../interfaces/preBooking.interface";
import { OriginDestinationOption } from "../interfaces/revalidateRes.interface";
import { PreBookingModels } from "../models/preBooking.models";
// FORMAT FLIGHT SEARCH RESPONSE
const imageBaseUrl = "https://flightkiya.cosmelic.com/public/airlines/";

export const FormatFlightSearch = async (data: any, conn: PreBookingModels) => {
  // FORMAT & FILTER DATA
  const filter: {
    airlines: any[];
    flight_numbers: string[];
    stops: number[];
  } = {
    airlines: [],
    flight_numbers: [],
    stops: [],
  };

  const formatFlightSegments: any[] = [];

  // SEGMENTS
  for (let item of data?.FlightSegmentList) {
    // airline name
    const operating_airline = await conn.getAirline(item?.OperatingCarrierCode);
    const marketing_airline = await conn.getAirline(item?.MarketingCarriercode);

    // airport name
    const departure_airport = await conn.getAirport(
      item?.DepartureAirportLocationCode
    );
    const arrival_airport = await conn.getAirport(
      item?.ArrivalAirportLocationCode
    );

    if (
      !filter?.airlines?.some(
        (airline) => airline?.value === item?.OperatingCarrierCode
      )
    ) {
      filter.airlines.push({
        value: item?.OperatingCarrierCode,
        label: operating_airline,
      });
    }

    if (!filter.flight_numbers.includes(item?.OperatingFlightNumber)) {
      filter.flight_numbers.push(item?.OperatingFlightNumber);
    }
    if (!filter.stops.includes(item?.stops)) {
      filter.stops.push(item?.stops);
    }

    formatFlightSegments.push({
      operating_airline,
      marketing_airline,
      flight_no: item?.MarketingCarriercode + item?.MarketingFlightNumber,
      departure_airport: departure_airport?.name,
      departure_city: departure_airport?.city,
      arrival_airport: arrival_airport?.name,
      arrival_city: arrival_airport?.city,
      ...item,
    });
  }

  const results = [];
  // PRICED ITINERARIES
  for (const pricedItem of data.PricedItineraries) {
    const segments = pricedItem?.OriginDestinations?.map((item: any) => {
      const segment = formatFlightSegments.find(
        (item1) => item1.SegmentRef === item.SegmentRef
      );
      const itinerary = data.ItineraryReferenceList.find(
        (item1: any) => item1.ItineraryRef === item.SegmentRef
      );

      return { legIndicator: item.LegIndicator, ...segment, ...itinerary };
    });

    const fareData = data?.FlightFaresList?.find(
      (item: any) => item.FareRef === pricedItem.FareRef
    );

    let fares = {
      ...fareData,
      ...fareData.PassengerFare[0], // Spread the first PassengerFare item into fares
    };

    delete fares.PassengerFare; // Remove the PassengerFare array
    delete fares.TaxBreakUp;

    const penaltiesData = data?.PenaltiesInfoList?.find(
      (item: any) => item.PenaltiesInfoRef === pricedItem.PenaltiesInfoRef
    )?.Penaltydetails[0];
    const fullfillmentData = data?.FulfillmentDetailsList?.find(
      (item: any) =>
        item.FulfillmentDetailsRef === pricedItem.FulfillmentDetailsRef
    );

    const airline_name = await conn.getAirline(pricedItem.ValidatingCarrier);

    const coreFlightInfo = getCoreFlightInfo(segments);

    results.push({
      flight_id: uuidv4(),
      airline: pricedItem.ValidatingCarrier,
      airline_name,
      airline_img: imageBaseUrl + pricedItem.ValidatingCarrier + ".png",
      ...coreFlightInfo,
      segments,
      fares,
      penaltiesData,
      fullfillmentData,
      fareSourceCode: pricedItem?.FareSourceCode,
    });
  }

  return { count: results.length, results, filter };
};

// FILTER BY CARRIER CODE / AIRLINES
export const filterByCarrierCode = (data: any, carrierCode: string) => {
  if (carrierCode) {
    return data.filter((flight: any) =>
      flight.originDestinations.some((destination: any) =>
        carrierCode
          .replace(" ", "")
          .split(",")
          .includes(destination.OperatingCarrierCode)
      )
    );
  }
  return data;
};

// FILTER BY FLIGHT NUMBERS
export const filterByFlightNumber = (data: any, flightNumber: string) => {
  if (flightNumber) {
    return data.filter((flight: any) =>
      flight.originDestinations.some((destination: any) =>
        flightNumber
          .replace(" ", "")
          .split(",")
          .includes(destination.OperatingFlightNumber)
      )
    );
  }
  return data;
};

// FILTER BY STOPS
export const filterByStops = (data: any, stops: string) => {
  if (stops) {
    return data.filter((flight: any) =>
      flight.originDestinations.some((destination: any) =>
        stops
          .replace(" ", "")
          .split(",")
          .includes(destination.stops + "")
      )
    );
  }
  return data;
};

// FILTER BY REFUNDABLE
export const filterByRefundable = (data: any, refundable: string) => {
  if (refundable && refundable === "true") {
    return data.filter((flight: any) =>
      flight.penaltiesData.some(
        (item: any) => item.RefundAllowed === refundable
      )
    );
  }
  return data;
};

// FORMAT REVALIDATION RESPONSE
export const formatRevalidation = async (Data: any, conn: PreBookingModels) => {
  if (!Data) {
    return;
  }

  const TraceId = Data.TraceId;
  const PricedItineraries = Data.PricedItineraries;

  for (const item of PricedItineraries) {
    const formattedAirItinerary = formatAirItinerary(
      item.AirItineraryPricingInfo
    );

    const flights = await formatOriginDestination(
      item.OriginDestinationOptions,
      conn
    );

    const data = {
      TraceId,
      flights,
      ...formattedAirItinerary,
      PaxNameCharacterLimit: item.PaxNameCharacterLimit,
      SequenceNumber: item.SequenceNumber,
      TicketType: item.TicketType,
      ValidatingAirlineCode: item.ValidatingAirlineCode,
      VoidWindowTLinMins: item.VoidWindowTLinMins,
      DirectionInd: item.DirectionInd,
      HoldAllowed: item.HoldAllowed,
      IsPassportMandatory: item.IsPassportMandatory,
    };

    return data as IFormattedRevalidation;
  }
};

const formatAirItinerary = (AirItineraryPricingInfo: any) => {
  const {
    DivideInPartyIndicator,
    FareInfos,
    FareSourceCode,
    FareType,
    IsRefundable,
    PTC_FareBreakdowns,
    ItinTotalFare,
  } = AirItineraryPricingInfo;
  const { BaseFare, EquivFare, TotalFare, TotalTax } = ItinTotalFare;

  const formattedPtc = formatPtcData(PTC_FareBreakdowns);

  const formattedAirItnerary = {
    formattedPtc,
    FareSourceCode,
    BaseFare,
    EquivFare,
    TotalFare,
    TotalTax,
    DivideInPartyIndicator,
    FareInfos,
    FareType,
    IsRefundable,
  };

  return formattedAirItnerary;
};

const formatOriginDestination = async (
  OriginDestinationOptions: any,
  conn: PreBookingModels
) => {
  const segments = [];

  for (const item of OriginDestinationOptions) {
    const FlightSegments = item?.FlightSegments;

    const flightSegments = [];
    for (const segItem of FlightSegments) {
      const { OperatingAirline, SeatsRemaining, ...resSegment } = segItem;

      const departureAirport = await conn.getAirport(
        segItem?.DepartureAirportLocationCode
      );
      const arrivalAirport = await conn.getAirport(
        segItem?.ArrivalAirportLocationCode
      );
      const operating_airline = await conn.getAirline(OperatingAirline?.Code);
      const marketing_airline = await conn.getAirline(
        segItem?.MarketingAirlineCode
      );

      flightSegments.push({
        departureAirport: departureAirport?.name,
        departureCity: departureAirport?.city,
        arrivalAirport: arrivalAirport?.name,
        arrivalCity: arrivalAirport?.city,
        operating_airline,
        marketing_airline,
        ...resSegment,
        OperatingAirlineCode: OperatingAirline?.Code,
        airline_img: imageBaseUrl + OperatingAirline?.Code + ".png",
        OperatingAirlineEquipment: OperatingAirline?.Equipment,
        OperatingAirlineFlightNumber: OperatingAirline?.FlightNumber,
        SeatsRemainingBelowMinimum: SeatsRemaining?.BelowMinimum,
        SeatsRemaining: SeatsRemaining?.Number,
      });
    }

    segments.push({ flightSegments });
  }

  return segments;
};

function formatPtcData(data: any[]) {
  return data?.map((item) => ({
    passengerCode: item.PassengerTypeQuantity.Code,
    passengerQuantity: item.PassengerTypeQuantity.Quantity,
    BaseFare: item.PassengerFare.BaseFare,
    EquivFare: item.PassengerFare.EquivFare,
    Surcharges: item.PassengerFare.Surcharges,
    TotalFare: item.PassengerFare.TotalFare,
    BaggageInfo: item.BaggageInfo,
    CabinBaggageInfo: item.CabinBaggageInfo,
    FareBasisCodes: item.FareBasisCodes,
    PenaltiesInfo: item.PenaltiesInfo,
  }));
}

export function formatAirTravelersData(
  input: IAirTravelersRequest,
  OriginDestinationOptions: OriginDestinationOption[],
  FareSourceCode: string
): any {
  const RequestedSegments = OriginDestinationOptions[0].FlightSegments?.map(
    (segment) => ({
      Origin: segment.DepartureAirportLocationCode,
      Destination: segment.ArrivalAirportLocationCode,
      FlightNumber: `${segment.OperatingAirline.Code}${segment.FlightNumber}`,
      DepartureDateTime: segment.DepartureDateTime,
      RequestSSRs: [
        {
          SSRCode: "Any",
          FreeText: "Meal MOML",
        },
      ],
    })
  );

  return {
    FareSourceCode: FareSourceCode,
    TravelerInfo: {
      AirTravelers: input.AirTravelers?.map((traveler) => ({
        ...traveler,
        SpecialServiceRequest: {
          SeatPreference: "Any",
          MealPreference: "Any",
          RequestedSegments,
        },
      })),
      CountryCode: input.CountryCode,
      AreaCode: input.AreaCode,
      PhoneNumber: input.PhoneNumber,
      Email: input.Email,
      PostCode: input.PostCode,
    },
    Target: process.env.API_TARGET,
  };
}

// ============ HELPER UTILS

const getCoreFlightInfo = (segments: any[]) => {
  const result = {
    flightNo:
      segments[0]?.MarketingCarriercode + segments[0]?.MarketingFlightNumber,
    departureAirportCode: segments[0]?.DepartureAirportLocationCode,
    departureAirportName: segments[0]?.departure_airport,
    arrivalAirportCode:
      segments[segments.length - 1]?.ArrivalAirportLocationCode,
    arrivalAirportName: segments[segments?.length - 1]?.arrival_airport,
    DepartureDateTime: segments[0]?.DepartureDateTime,
    ArrivalDateTime: segments[segments?.length - 1]?.ArrivalDateTime,
    stoppage: segments?.length - 1,
    stoppageAirports: segments
      ?.slice(1)
      ?.map((flight: any) => flight.DepartureAirportLocationCode),
    layoverTime: calculateLayoverTime(segments),
  };

  return result;
};
// Function to calculate the total layover time
function calculateLayoverTime(data: any[]) {
  let totalLayoverMinutes = 0;

  for (let i = 0; i < data.length - 1; i++) {
    const currentArrival = new Date(data[i]?.ArrivalDateTime).getTime(); // Get timestamp
    const nextDeparture = new Date(data[i + 1]?.DepartureDateTime).getTime(); // Get timestamp
    totalLayoverMinutes += (nextDeparture - currentArrival) / (1000 * 60); // Convert milliseconds to minutes
  }

  const hours = Math.floor(totalLayoverMinutes / 60);
  const minutes = totalLayoverMinutes % 60;
  return `${hours} hours and ${minutes} minutes`;
}
