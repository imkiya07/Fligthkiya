export const FormatFlightSearch = (data: any) => {
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

  data?.FlightSegmentList?.forEach((item: any) => {
    // airline name
    const operating_airline = "operating";
    const marketing_airline = "marketing";
    // airport name
    const departure_airport = "departure";
    const arrival_airport = "arrival";

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
  });

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

  return { filter, results };
};
