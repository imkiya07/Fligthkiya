import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { Request, Response } from "express";
import db from "../../config/db";
import { flightModel } from "./flight.models";

interface AxiosError<T = any> extends Error {
  config?: AxiosRequestConfig; // The config used to make the request
  code?: string; // Error code, if any
  request?: any; // The request that was made (in case no response was received)
  response?: AxiosResponse<T>; // The response received (if the request was successful but returned an error status)
  isAxiosError?: boolean; // A flag that this is an axios error
  toJSON: () => object; // Converts error object to JSON
}

export class FlightService {
  private models: flightModel;
  constructor() {
    this.models = new flightModel(db);
  }

  async flightSearch(req: Request) {
    const reqBody = req.body;

    try {
      // API URL
      const url = "https://restapidemo.myfarebox.com/api/v2/Search/Flight";
      const BEARER_TOKEN = "52AE7086-9529-488F-8BC4-BB57CF7B3802-6386";

      // Request body as provided
      const requestBody = {
        OriginDestinationInformations: [
          {
            DepartureDateTime: "2025-02-03T00:00:00",
            OriginLocationCode: "BLR",
            DestinationLocationCode: "DXB",
          },
          {
            DepartureDateTime: "2025-02-13T00:00:00",
            OriginLocationCode: "DXB",
            DestinationLocationCode: "BLR",
          },
        ],
        TravelPreferences: {
          MaxStopsQuantity: "Direct",
          VendorPreferenceCodes: ["EK"],
          CabinPreference: "Y",
          Preferences: {
            CabinClassPreference: {
              CabinType: "Y",
              PreferenceLevel: "Restricted",
            },
          },
          AirTripType: "Return",
        },
        PricingSourceType: "Public",
        IsRefundable: true,
        PassengerTypeQuantities: [
          {
            Code: "ADT",
            Quantity: 1,
          },
        ],
        RequestOptions: "Fifty",
        NearByAirports: true,
        Target: "Test",
        ConversationId: "MY_SECRET",
      };

      // Making the POST request
      const response = await axios.post(url, requestBody, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${BEARER_TOKEN}`,
        },
      });

      return response?.data;
    } catch (err) {
      const error = err as AxiosError;

      if (error.response) {
        // Server responded with a status other than 2xx
        console.error("Response error:", {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers,
        });

        return {
          status: error.response.status,
          message: "API error occurred",
          error: error.response.data,
        };
      } else if (error.request) {
        // No response received from the server
        console.error("No response received:", error.request);
        return {
          status: error.request.status,
          message: "No response received from the API",
          error: error.message,
        };
      } else {
        // Any other error in setting up the request
        console.error("Request setup error:", error.message);
        return {
          status: 500,
          message: "Error in making the request",
          error: error.message,
        };
      }
    }
  }

  async getAllFlights() {
    return { success: true, message: "All flights", data: [] };
    return await this.models.getAllFlights();
  }

  async getFlightById(id: number) {
    return await this.models.getFlightById(id);
  }

  async createFlight(flightData: any) {
    return await this.models.createFlight(flightData);
  }

  async updateFlight(id: any, flightData: number) {
    return await this.models.updateFlight(id, flightData);
  }

  async deleteFlight(id: number) {
    return await this.models.deleteFlight(id);
  }
}
