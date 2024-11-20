export interface IRevalidateRes {
  Data: Data;
  Success: boolean;
}

export interface Data {
  ConversationId: string;
  Errors: any[];
  IsValid: boolean;
  PricedItineraries: PricedItinerary[];
  Success: boolean;
  Target: string;
  TraceId: string;
  ExtraServices: ExtraServices;
}

export interface PricedItinerary {
  AirItineraryPricingInfo: AirItineraryPricingInfo;
  DirectionInd: string;
  HoldAllowed: string;
  IsPassportMandatory: boolean;
  OriginDestinationOptions: OriginDestinationOption[];
  PaxNameCharacterLimit: number;
  Provider: string;
  RequiredFieldsToBook: string[];
  SequenceNumber: number;
  TicketType: string;
  ValidatingAirlineCode: string;
  VoidWindowTLinMins: string;
}

export interface AirItineraryPricingInfo {
  DivideInPartyIndicator: boolean;
  FareInfos: FareInfo[];
  FareSourceCode: string;
  FareType: string;
  IsRefundable: string;
  ItinTotalFare: ItinTotalFare;
  PTC_FareBreakdowns: PtcFareBreakdown[];
}

export interface FareInfo {
  FareReference: string;
}

export interface ItinTotalFare {
  BaseFare: BaseFare;
  EquivFare: EquivFare;
  TotalFare: TotalFare;
  TotalTax: TotalTax;
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

export interface TotalTax {
  Amount: string;
  CurrencyCode: string;
  DecimalPlaces: number;
}

export interface PtcFareBreakdown {
  BaggageInfo: string[];
  CabinBaggageInfo: string[];
  FareBasisCodes: string[];
  PassengerFare: PassengerFare;
  PassengerTypeQuantity: PassengerTypeQuantity;
  PenaltiesInfo: PenaltiesInfo[];
}

export interface PassengerFare {
  BaseFare: BaseFare2;
  EquivFare: EquivFare2;
  Surcharges: any[];
  Taxes: Tax[];
  TotalFare: TotalFare2;
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

export interface Tax {
  Amount: string;
  CurrencyCode: string;
  DecimalPlaces: number;
  TaxCode: string;
}

export interface TotalFare2 {
  Amount: string;
  CurrencyCode: string;
  DecimalPlaces: number;
}

export interface PassengerTypeQuantity {
  Code: string;
  Quantity: number;
}

export interface PenaltiesInfo {
  Allowed: boolean;
  Amount: string;
  CurrencyCode: string;
  PenaltyType: string;
}

export interface OriginDestinationOption {
  FlightSegments: FlightSegment[];
}

export interface FlightSegment {
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
  OperatingAirline: OperatingAirline;
  ResBookDesigCode: string;
  ResBookDesigText: string;
  SeatsRemaining: SeatsRemaining;
  StopQuantity: number;
  StopQuantityInfo: StopQuantityInfo;
}

export interface OperatingAirline {
  Code: string;
  Equipment: string;
  FlightNumber: string;
}

export interface SeatsRemaining {
  BelowMinimum: boolean;
  Number: number;
}

export interface StopQuantityInfo {
  ArrivalDateTime: string;
  DepartureDateTime: string;
  Duration: number;
  LocationCode: string;
}

export interface ExtraServices {
  NameNumbers: any[];
  Services: any[];
}
