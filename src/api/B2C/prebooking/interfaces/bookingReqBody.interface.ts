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
  CountryCode: string;
  AreaCode: string;
  PhoneNumber: string;
  Email: string;
  PostCode: string;
  revalidation_req_body: string;
}
