import { Request } from "express";
import AbstractServices from "../../../core/abstract/abstract.services";
import { IRefundReqBody, IReissueBody } from "./admin.interface";

export class AdminServices extends AbstractServices {
  constructor() {
    super();
  }

  /**
   * @CancelBooking
   */
  cancelBooking = async (req: Request) => {
    const pnrId = req.params.pnrId;

    const payload = {
      UniqueID: pnrId,
      Target: process.env.API_TARGET,
      ConversationId: "string",
    };

    const response = await this.Req.request(
      "POST",
      "/v1/api/v1/Booking/Cancel",
      payload
    );

    return {
      success: true,
      message: "Booking cancel successfully",
      response,
    };
  };

  /**
   * @SearchInvoice
   */
  searchInvoice = async (req: Request) => {
    return {
      success: true,
      message: "Admin created successfully",
    };
  };

  /**
   * @ScheduleChange
   */
  scheduleChange = async (req: Request) => {
    return {
      success: true,
      message: "Admin created successfully",
    };
  };

  /**
   * @voidRequest
   */
  voidRequest = async (req: Request) => {
    const reqBody = req.body as IRefundReqBody;

    try {
      const response = await this.Req.request("POST", "/Void", reqBody);

      if (response?.Success) {
        return {
          success: true,
          message: "Successfully ticket voided",
          data: response?.Data,
        };
      } else {
        throw new Error(response?.Message);
      }
    } catch (error: any) {
      return {
        success: false,
        message: "Failed void ticket",
        error: error?.message,
      };
    }
  };

  /**
   * @reissueRequest
   */
  reissueRequest = async (req: Request) => {
    const reissue = req.body as IReissueBody;

    try {
      const response = await this.Req.request("POST", "/Reissue", reissue);

      return {
        success: true,
        message: "Admin created successfully",
        response,
      };
    } catch (error: any) {
      return {
        success: false,
        message: "Failed reissue",
        error: error?.message,
      };
    }
  };

  /**
   * @refundRequest
   */
  refundRequest = async (req: Request) => {
    const reissue = req.body as IRefundReqBody;

    try {
      const response = await this.Req.request("POST", "/Refund", reissue);

      if (response?.Success) {
        return {
          success: true,
          message: "Admin created successfully",
          data: response?.Data,
        };
      } else {
        throw Error(response?.Message);
      }
    } catch (error: any) {
      return {
        success: false,
        message: "Failed reissue",
        error: error?.message,
      };
    }
  };
}
