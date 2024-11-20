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

interface IAirTraveler {
  PassengerType: string; // e.g., "ADT" for adult
  Gender: string; // e.g., "M" for male, "F" for female
  PassengerName: {
    PassengerTitle: string; // e.g., "MR", "MS", etc.
    PassengerFirstName: string;
    PassengerLastName: string;
  };
  DateOfBirth: string; // ISO 8601 date string
  Passport: {
    PassportNumber: string;
    ExpiryDate: string; // ISO 8601 date string
    Country: string; // Country code, e.g., "IN"
  };
  PassengerNationality: string; // Country code, e.g., "IN"
  NationalID: string; // Country code, e.g., "IN"
}

export interface IAirTravelersRequest {
  AirTravelers: IAirTraveler[];
  CountryCode: string; // e.g., "91" for India
  AreaCode: string; // e.g., "080"
  PhoneNumber: string; // e.g., "87657897"
  Email: string; // Email address
  PostCode: string; // Postal code, e.g., "560028"
}
