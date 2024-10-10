import { flightModel } from "../flight.models";

// FORMAT FLIGHT SEARCH RESPONSE
export const FormatFlightSearch = async (data: any, conn: flightModel) => {
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

  // FORMAT ALL DATA
  const results = data.PricedItineraries.map((pricedItem: any) => {
    const originDestinations = pricedItem?.OriginDestinations?.map(
      (item: any) => {
        const segment = formatFlightSegments.find(
          (item1) => item1.SegmentRef === item.SegmentRef
        );
        const itinerary = data.ItineraryReferenceList.find(
          (item1: any) => item1.ItineraryRef === item.SegmentRef
        );

        return { legIndicator: item.LegIndicator, ...segment, ...itinerary };
      }
    );

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

    return {
      fareSourceCode: pricedItem?.FareSourceCode,
      fares,
      penaltiesData,
      fullfillmentData,
      originDestinations,
    };
  });

  return { count: results.length, filter, results };
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
