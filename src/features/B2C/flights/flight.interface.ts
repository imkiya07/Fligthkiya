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
