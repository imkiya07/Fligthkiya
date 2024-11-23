export interface IFormattedRevalidation {
  TraceId: string;
  flights: Flight[];
  formattedPtc: FormattedPtc[];
  BaseFare: BaseFare2;
  EquivFare: EquivFare2;
  TotalFare: TotalFare2;
  TotalTax: TotalTax;
  DivideInPartyIndicator: boolean;
  FareInfos: FareInfo[];
  FareType: string;
  IsRefundable: string;
  PaxNameCharacterLimit: number;
  SequenceNumber: number;
  TicketType: string;
  ValidatingAirlineCode: string;
  VoidWindowTLinMins: string;
  DirectionInd: string;
  HoldAllowed: string;
  IsPassportMandatory: boolean;
}

export interface Flight {
  flightSegments: FlightSegment[];
}

export interface FlightSegment {
  departureAirport: string;
  departureCity: string;
  arrivalAirport: string;
  arrivalCity: string;
  operating_airline: string;
  marketing_airline: string;
  ArrivalAirportLocationCode: string;
  ArrivalDateTime: string;
  CabinClassCode: string;
  CabinClassText: string;
  DepartureAirportLocationCode: string;
  DepartureDateTime: string;
  Eticket: boolean;
  FlightNumber: string;
  JourneyDuration: number;
  MarketingAirlineCode: string;
  MarriageGroup: string;
  MealCode: string;
  ResBookDesigCode: string;
  ResBookDesigText: string;
  StopQuantity: number;
  StopQuantityInfo: StopQuantityInfo;
  OperatingAirlineCode: string;
  airline_img: string;
  OperatingAirlineEquipment: string;
  OperatingAirlineFlightNumber: string;
  SeatsRemainingBelowMinimum: boolean;
  SeatsRemaining: number;
}

export interface StopQuantityInfo {
  ArrivalDateTime: string;
  DepartureDateTime: string;
  Duration: number;
  LocationCode: string;
}

export interface FormattedPtc {
  passengerCode: string;
  passengerQuantity: number;
  BaseFare: BaseFare;
  EquivFare: EquivFare;
  Surcharges: any[];
  TotalFare: TotalFare;
  BaggageInfo: string[];
  CabinBaggageInfo: string[];
  FareBasisCodes: string[];
  PenaltiesInfo: PenaltiesInfo[];
}

export interface BaseFare {
  Amount: string;
  CurrencyCode: string;
  DecimalPlaces: number;
}

export interface EquivFare {
  Amount: string;
  CurrencyCode: string;
  DecimalPlaces: number;
}

export interface TotalFare {
  Amount: string;
  CurrencyCode: string;
  DecimalPlaces: number;
}

export interface PenaltiesInfo {
  Allowed: boolean;
  Amount: string;
  CurrencyCode: string;
  PenaltyType: string;
}

export interface BaseFare2 {
  Amount: string;
  CurrencyCode: string;
  DecimalPlaces: number;
}

export interface EquivFare2 {
  Amount: string;
  CurrencyCode: string;
  DecimalPlaces: number;
}

export interface TotalFare2 {
  Amount: string;
  CurrencyCode: string;
  DecimalPlaces: number;
}

export interface TotalTax {
  Amount: string;
  CurrencyCode: string;
  DecimalPlaces: number;
}

export interface FareInfo {
  FareReference: string;
}
