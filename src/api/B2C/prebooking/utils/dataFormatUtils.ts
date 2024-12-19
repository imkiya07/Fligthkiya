export const getFlights = (segments: any[]) => {
  const groupedData = Object.values(
    segments.reduce((acc: any, segment: any) => {
      const leg = segment.legIndicator;
      if (!acc[leg]) {
        acc[leg] = {
          legIndicator: leg,
          DepartureDateTime: segment.DepartureDateTime,
          ArrivalDateTime: segment.ArrivalDateTime,
          DepartureAirportLocationCode: segment.DepartureAirportLocationCode,
          ArrivalAirportLocationCode: segment.ArrivalAirportLocationCode,
          departure_airport: segment.departure_airport,
          arrival_airport: segment.arrival_airport,
          departure_city: segment.departure_city,
          arrival_city: segment.arrival_city,
          totalJourneyDuration: 0,
          totalStops: 0,
        };
      }
      acc[leg].arrival_airport = segment.arrival_airport;
      acc[leg].ArrivalDateTime = segment.ArrivalDateTime;
      acc[leg].totalJourneyDuration += segment.JourneyDuration;
      acc[leg].totalStops += segment.stops;
      return acc;
    }, {})
  );

  return groupedData;
};
