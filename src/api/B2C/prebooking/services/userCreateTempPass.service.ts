import nodemailer from "nodemailer";
import AbstractServices from "../../../../core/abstract/abstract.services";
import { AuthModel } from "../../../auth/AuthModel";
import { hashPassword } from "../../../auth/authServices";
import { generateToken } from "../../../auth/authUtils";
import { IBookingReqBody } from "../interfaces/bookingReqBody.interface";

export class UserCreateWithTempPass extends AbstractServices {
  constructor() {
    super();
  }

  createUserAndSendEmail = async (data: IBookingReqBody) => {
    const conn = new AuthModel(this.db);
    const { CountryCode, AreaCode, PhoneNumber, Email, AirTravelers } = data;
    const { PassengerFirstName, PassengerLastName } =
      AirTravelers[0]?.PassengerName;

    const isUnique = await conn.isEmailUnique(Email);

    if (!isUnique) {
      const { password_hash, ...restData } = await conn.getUserByEmail(Email);
      const token = generateToken(restData);

      return { user_id: restData?.user_id, token };
    }

    // 1. Generate temporary password
    const tempPassword = this.#generateTemporaryPassword();

    const passwordHash = hashPassword(tempPassword);

    // 3. Register the user
    const email = Email;
    const phone_number = `${CountryCode}${AreaCode}${PhoneNumber}`;
    const full_name = PassengerFirstName + " " + PassengerLastName;
    const username = email.split("@")[0]; // Create username from email

    const user_id = await conn.registerUser({
      email,
      full_name,
      password_hash: passwordHash,
      phone_number,
      username,
    });

    const userCard = {
      user_id,
      account_verified: 0,
      full_name,
      username,
      email,
      phone_number,
    };

    const token = generateToken(userCard);

    // 4. Send the email
    await this.#sendTemporaryPasswordEmail(email, tempPassword);

    return { user_id, token };
  };

  #generateTemporaryPassword = () => {
    return Math.random().toString(36).slice(-8);
  };

  #sendTemporaryPasswordEmail = async (email: string, tempPassword: string) => {
    const transporter = nodemailer.createTransport({
      service: "Gmail", // Or another SMTP service
      auth: {
        user: process.env.EMAIL_SEND_EMAIL_ID,
        pass: process.env.EMAIL_SEND_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_SEND_EMAIL_ID, //"your-email@gmail.com",
      to: email,
      subject: "Flight Kiya - Your Temporary Password",
      text: `Hello,\n\nYour temporary password is: ${tempPassword}\n\nPlease log in and change your password as soon as possible.\n\nThank you.`,
    };

    await transporter.sendMail(mailOptions);
  };
}
