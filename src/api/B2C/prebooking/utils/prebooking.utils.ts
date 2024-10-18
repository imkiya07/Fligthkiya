import { v4 as uuidv4 } from "uuid";
import { PreBookingModels } from "../models/preBooking.models";
// FORMAT FLIGHT SEARCH RESPONSE
export const FormatFlightSearch = async (data: any, conn: PreBookingModels) => {
  const imageBaseUrl = "https://fk-api.adbiyas.com/public/airlines/";
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
      departure_airport,
      arrival_airport,
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

    results.push({
      flight_id: uuidv4(),
      airline: pricedItem.ValidatingCarrier,
      airline_name,
      airline_img: imageBaseUrl + pricedItem.ValidatingCarrier + ".png",
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

    return data;
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
  const {
    BaggageInfo,
    CabinBaggageInfo,
    FareBasisCodes,
    PassengerTypeQuantity,
    PenaltiesInfo,
    PassengerFare,
  } = PTC_FareBreakdowns[0];
  const {
    BaseFare: passengerBaseFare,
    EquivFare: passengerEquivFare,
    TotalFare: passengerTotalFare,
    Surcharges,
    Taxes,
  } = PassengerFare;

  const formattedAirItnerary = {
    FareSourceCode,
    BaseFare,
    EquivFare,
    TotalFare,
    TotalTax,
    DivideInPartyIndicator,
    FareInfos,
    FareType,
    IsRefundable,
    BaggageInfo,
    CabinBaggageInfo,
    FareBasisCodes,
    PassengerTypeQuantity,
    PenaltiesInfo,
    Surcharges,
    Taxes,
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
        departureAirport,
        arrivalAirport,
        operating_airline,
        marketing_airline,
        ...resSegment,
        OperatingAirlineCode: OperatingAirline?.Code,
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
