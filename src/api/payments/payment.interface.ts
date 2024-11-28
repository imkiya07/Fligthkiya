import {
  AirItineraryPricingInfo,
  OriginDestinationOption,
} from "../B2C/preBooking/interfaces/revalidateRes.interface";

export interface PassengerInfo {
  amount: number;
  currency: string;
  PassengerType: "ADT" | "CHD" | "INF"; // Adult, Child, Infant
  PassengerTitle: "Mr" | "Mrs" | "Ms" | "Miss" | "Mstr";
  Gender: "M" | "F" | "U"; // Male, Female, Unspecified
  PassengerFirstName: string;
  PassengerLastName: string;
  DateOfBirth: string; // ISO 8601 string format
  CountryCode: string;
  AreaCode: string;
  PhoneNumber: string;
  Email: string;
  PostCode: string;
  PassportNumber: string;
  ExpiryDate: string; // ISO 8601 string format
  Country: string; // 2-letter country code
}

export interface IBookingResponse {
  Data: {
    ClientUTCOffset: number;
    ConversationId: string;
    Errors: any[];
    Status: string;
    Target: string;
    TktTimeLimit: string;
    TraceId: string;
    UniqueID: string;
  };
  Success: boolean;
  Message: string;
}

export interface ICachedRevalidation {
  OriginDestinationOptions: OriginDestinationOption[];
  AirItineraryPricingInfo: AirItineraryPricingInfo;
}
