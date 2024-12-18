export const getFlights = (segments: any[]) => {
  const groupedData = Object.values(
    segments.reduce((acc: any, segment: any) => {
      const leg = segment.legIndicator;
      if (!acc[leg]) {
        acc[leg] = {
          legIndicator: leg,
          departure_airport: segment.departure_airport,
          departure_city: segment.departure_city,
          DepartureAirportLocationCode: segment.DepartureAirportLocationCode,
          departure_date_time: segment.DepartureDateTime,
          arrival_airport: segment.arrival_airport,
          arrival_city: segment.arrival_city,
          ArrivalAirportLocationCode: segment.ArrivalAirportLocationCode,
          ArrivalDateTime: segment.ArrivalDateTime,
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
