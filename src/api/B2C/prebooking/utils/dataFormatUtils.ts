import { imageBaseUrl } from "./preBooking.utils";

export const getFlights = (segments: any) => {
  const groupedData = Object.values(
    segments.reduce((acc: any, segment: any) => {
      const leg = segment.legIndicator;
      if (!acc[leg]) {
        acc[leg] = {
          legIndicator: leg,
          airline: segment.marketing_airline,
          airline_img:
            imageBaseUrl +
            (segment?.OperatingCarrierCode || segment?.MarketingCarriercode) +
            ".png",
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
      } else {
        // Update the ArrivalAirportLocationCode to reflect the last segment's arrival
        acc[leg].ArrivalAirportLocationCode =
          segment.ArrivalAirportLocationCode;
      }
      acc[leg].totalJourneyDuration += segment.JourneyDuration;
      acc[leg].totalStops += segment.stops;
      return acc;
    }, {})
  );

  return groupedData;
};
