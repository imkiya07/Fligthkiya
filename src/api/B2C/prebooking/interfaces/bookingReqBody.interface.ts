import { ITravellersBody } from "../../travelers/travelers.interfaces";

export interface IBookingContact {
  CountryCode: string;
  AreaCode: string;
  PhoneNumber: string;
  Email: string;
  PostCode: string;
}

export interface IBookingReqBody extends IBookingContact {
  AirTravelers: AirTraveler[];
}

export interface AirTraveler {
  travelerId?: number;
  PassengerType: string;
  Gender: string;
  PassengerName: PassengerName;
  DateOfBirth: string;
  Passport: Passport;
  PassengerNationality: string;
  NationalID: string;
}

export interface PassengerName {
  PassengerTitle: string;
  PassengerFirstName: string;
  PassengerLastName: string;
}

export interface Passport {
  PassportNumber: string;
  ExpiryDate: string;
  Country: string;
}

export interface IAirTravelers {
  user_id: number;
  booking_id: number;
  PassengerType: string;
  Gender: string;
  DateOfBirth: string;
  NationalID: string;
  PassengerNationality: string;
  PassengerTitle: string;
  PassengerFirstName: string;
  PassengerLastName: string;
  PassportNumber: string;
  ExpiryDate: string;
  Country: string;
}

export interface IBookingInfo {
  user_id: number;
  orderNumber: string;
  PhoneNumber: string;
  Email: string;
  revalidation_req_body?: string;
}

export interface IPdfData {
  orderNumber: string;
  PhoneNumber: string;
  Email: string;
  airline_name: string;
  departureAirportCode: string;
  departureAirportName: string;
  arrivalAirportCode: string;
  arrivalAirportName: string;
  DepartureDateTime: string;
  ArrivalDateTime: string;
  flightNo: string;
  ticketStatus: string;
  passengerData: ITravellersBody[];
}
