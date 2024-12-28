import { Request } from "express";
import nodemailer from "nodemailer";
import AbstractServices from "../../../../core/abstract/abstract.services";
import { bookingRequestTemplate } from "../../../../core/common/emailTemplate";
import { IBookingReqBody } from "../interfaces/bookingReqBody.interface";
import { BookingModels } from "../models/booking.models";
import { UserCreateWithTempPass } from "./userCreateTempPass.service";

export class BookingRequestService extends AbstractServices {
  constructor() {
    super();
  }

  bookingRequest = async (req: Request) => {
    const body = req.body as IBookingReqBody;

    const conn = new BookingModels(this.db);
    const deviceId = req.deviceId;

    const revalidateReqBody = this.cache.get(`revalidateReqBody-${deviceId}`);

    if (!revalidateReqBody) {
      this.throwError("Revalidation is required!", 400);
    }

    const createUser = new UserCreateWithTempPass();
    const { token, user_id } = await createUser.createUserAndSendEmail(body);

    const orderNumber = generateOrderNumber();

    const bookingReqPayload = {
      user_id,
      orderNumber,
      CountryCode: body?.CountryCode,
      AreaCode: body?.AreaCode,
      PhoneNumber: body?.PhoneNumber,
      Email: body?.Email,
      PostCode: body?.PostCode,
      revalidation_req_body: JSON.stringify(revalidateReqBody),
      passengerBody: JSON.stringify(body),
      bookingStatus: "BIP",
    };

    const booking_id = await conn.insertBookingInfo(bookingReqPayload);

    const passengerData = body?.AirTravelers?.map((item) => {
      return {
        user_id,
        booking_id,
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
    });

    await conn.insertAirTravelers(passengerData);

    const transporter = nodemailer.createTransport({
      service: "Gmail", // Or another SMTP service
      auth: {
        user: process.env.EMAIL_SEND_EMAIL_ID,
        pass: process.env.EMAIL_SEND_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_SEND_EMAIL_ID, //"your-email@gmail.com",
      to: body?.Email,
      subject: "Flight Booking Request Successful",
      html: bookingRequestTemplate(bookingReqPayload, passengerData),
    };

    await transporter.sendMail(mailOptions);

    return {
      success: true,
      message: "Temporary booking successfully",
      data: {
        user_id,
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
