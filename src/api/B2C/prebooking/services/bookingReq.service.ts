import { Request } from "express";
import path from "path";
import AbstractServices from "../../../../core/abstract/abstract.services";
import { EmailSend } from "../../../../core/common/emailSender";
import { ITravellersBody } from "../../travelers/travelers.interfaces";
import { AirTravelersModel } from "../../travelers/travelers.models";
import {
  IBookingReqBody,
  IPdfData,
} from "../interfaces/bookingReqBody.interface";
import { BookingModels } from "../models/booking.models";
import { BookingPDFService } from "../utils/bookingReqPdfSend";
import { UserCreateWithTempPass } from "./userCreateTempPass.service";

export class BookingRequestService extends AbstractServices {
  constructor() {
    super();
  }

  bookingRequest = async (req: Request) => {
    const body = req.body as IBookingReqBody;

    const conn = new BookingModels(this.db);
    const bookingConn = new AirTravelersModel(this.db);
    const deviceId = req.deviceId;

    const revalidateReqBody = this.cache.get(`revalidateReqBody-${deviceId}`);

    const revalidationData = this.cache.get<any>(`revalidation-${deviceId}`);

    if (!revalidateReqBody || !revalidationData) {
      this.throwError("Revalidation is required!", 400);
    }

    const createUser = new UserCreateWithTempPass();

    let userId = req?.user_id;
    let token;
    if (!req?.user_id) {
      const loginInfo = await createUser.createUserAndSendEmail(body);
      userId = loginInfo?.user_id;
      token = loginInfo?.token;
    }

    const orderNumber = generateOrderNumber();

    const bookingReqPayload = {
      user_id: userId,
      orderNumber,
      PhoneNumber: body?.PhoneNumber,
      Email: body?.Email,
      // revalidation_req_body: "JSON.stringify(revalidateReqBody)",
      passengerBody: JSON.stringify(body),
      ticketStatus: "BOOKING_IN_PROGRESS",
    };

    const booking_id = await conn.insertBookingInfo(bookingReqPayload);

    const passengerData: ITravellersBody[] = [];

    for (const item of body?.AirTravelers) {
      const travelerPayload: ITravellersBody = {
        user_id: userId,
        PassengerType: item.PassengerType,
        Gender: item.Gender,
        DateOfBirth: item.DateOfBirth,
        NationalID: item.NationalID,
        PassengerNationality: item.PassengerNationality,
        PassengerTitle: item.PassengerName.PassengerTitle,
        PassengerFirstName: item.PassengerName.PassengerFirstName,
        PassengerLastName: item.PassengerName.PassengerLastName,
        PassportNumber: item?.Passport?.PassportNumber,
        ExpiryDate: item?.Passport?.ExpiryDate,
        Country: item?.Passport?.Country,
      };

      passengerData.push(travelerPayload);

      const traveller_id =
        item?.travelerId || (await bookingConn.createTraveler(travelerPayload));

      await this.db("booking_travellers").insert({
        booking_id,
        traveller_id,
      });
    }

    const pdfData: IPdfData = {
      orderNumber,
      airline_name: revalidationData?.airline_name,
      arrivalAirportCode: revalidationData?.arrivalAirportCode,
      arrivalAirportName: revalidationData?.arrivalAirportName,
      ArrivalDateTime: revalidationData?.ArrivalDateTime,
      departureAirportCode: revalidationData?.departureAirportCode,
      departureAirportName: revalidationData?.departureAirportName,
      DepartureDateTime: revalidationData?.DepartureDateTime,
      flightNo: revalidationData?.flightNo,
      Email: bookingReqPayload?.Email,
      PhoneNumber: bookingReqPayload?.PhoneNumber,
      ticketStatus: bookingReqPayload?.ticketStatus,
      passengerData,
    };

    const pdfPath = path.join(__dirname, "example.pdf");

    await BookingPDFService.generateProfessionalPDF(pdfData, pdfPath);
    await EmailSend.sendEmailWithPDF(
      pdfPath,
      body?.Email,
      "Ticket booking request"
    );

    return {
      success: true,
      message: "Temporary booking successfully",
      data: {
        user_id: userId,
        booking_id,
        orderNumber,
        token,
      },
    };
  };
}

function generateOrderNumber() {
  const prefix = "FL";
  const timestamp = Date.now(); // Current timestamp in milliseconds

  return `${prefix}${timestamp}`;
}
