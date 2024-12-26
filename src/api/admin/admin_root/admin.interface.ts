export interface IReissueBody {
  ptrType: string;
  mFRef: string;
  AllowChildPassenger: boolean;
  reissueQuoteRequestType: string;
  passengers: Passenger[];
  originDestinations: OriginDestination[];
}

export interface Passenger {
  firstName: string;
  lastName: string;
  title: string;
  eTicket: string;
  passengerType: string;
}

export interface OriginDestination {
  originLocationCode: string;
  destinationLocationCode: string;
  cabinPreference: string;
  departureDateTime: string;
  flightNumber: number;
  airlineCode: string;
}

export interface IRefundReqBody {
  ptrType: string;
  mFRef: string;
  passengers: Passenger[];
  AdditionalNote: string;
}

export interface Passenger {
  firstName: string;
  lastName: string;
  title: string;
  eTicket: string;
  passengerType: string;
}
