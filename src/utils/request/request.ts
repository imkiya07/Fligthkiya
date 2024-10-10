import axios, { AxiosError } from "axios";
import config from "../../config/config";

export class MakeRequest{

public postRequest = async(requestBody:any)=>{
    try {
        // Making the POST request
        const response = await axios.post(`${config.MYSTIFLY_API_URL}/v2/Search/Flight` as string, requestBody, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${config.BEARER_TOKEN}`,
          },     });
  
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


}