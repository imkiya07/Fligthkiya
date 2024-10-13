export interface IFlight {
  id?: number;
  departure: string;
  arrival: string;
  price: number;
  seatsAvailable: number;
}

export type fSearchParams = {
  airlines: string;
  flight_numbers: string;
  stops: string;
  refundable: string;
};

export interface IFlightCache {
  filter: any;
  results: any[];
}

export interface IFlightSegment {
  legIndicator: string;
  operating_airline: string;
  marketing_airline: string;
  departure_airport: string;
  arrival_airport: string;
  DepartureAirportLocationCode: string;
  ArrivalAirportLocationCode: string;
  DepartureDateTime: string;
  ArrivalDateTime: string;
  stops: number;
  JourneyDuration: number;
  Equipment: string;
  OperatingCarrierCode: string;
  OperatingFlightNumber: string;
  MarketingCarriercode: string;
  MarketingFlightNumber: string;
  StopQuantityInfos: any[];
  SegmentRef: number;
  CabinClassCode: string;
  RBD: string;
  FareFamily: string;
  SeatsRemaining: number;
  CheckinBaggage: CheckinBaggage[];
  CabinBaggage: CheckinBaggage[];
  FareBasisCodes: string;
  ItineraryRef: number;
}
interface CheckinBaggage {
  Type: string;
  Value: string;
}
