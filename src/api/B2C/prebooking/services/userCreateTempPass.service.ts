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
    await this.#sendTemporaryPasswordEmail(email, tempPassword, full_name);

    return { user_id, token };
  };

  #generateTemporaryPassword = () => {
    return Math.random().toString(36).slice(-8);
  };

  #sendTemporaryPasswordEmail = async (
    email: string,
    tempPassword: string,
    full_name: string
  ) => {
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
      html: getTemplate(tempPassword, full_name),
    };

    await transporter.sendMail(mailOptions);
  };
}

const getTemplate = (tempPassword: string, full_name: string) => {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Temporary Password</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f6f6f6;
        color: #333;
      }
      .email-container {
        max-width: 600px;
        margin: 20px auto;
        background-color: #fff;
        border: 1px solid #ddd;
        border-radius: 8px;
        overflow: hidden;
      }
      .header {
        background-color: #007bff;
        text-align: center;
        padding: 20px;
      }
      .header h1 {
        color: #fff;
        font-size: 24px;
        margin: 0;
      }
      .content {
        padding: 20px;
      }
      .content h2 {
        color: #333;
        font-size: 20px;
        margin-top: 0;
      }
      .content p {
        margin: 10px 0;
        line-height: 1.5;
      }
      .content .temporary-password {
        display: inline-block;
        background-color: #f8f9fa;
        color: #007bff;
        font-weight: bold;
        padding: 10px;
        border: 1px dashed #007bff;
        border-radius: 5px;
        font-size: 18px;
        margin: 10px 0;
      }
      .button {
        text-align: center;
        margin: 20px 0;
      }
      .button a {
        background-color: #007bff;
        color: #fff;
        text-decoration: none;
        padding: 10px 20px;
        border-radius: 5px;
        font-size: 16px;
      }
      .footer {
        background-color: #f6f6f6;
        text-align: center;
        padding: 10px;
        font-size: 12px;
        color: #999;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="header">
        <h1>Password Reset</h1>
      </div>
      <div class="content">
        <h2>Hello ${full_name},</h2>
        <p>
          We received a request to reset your password. Please use the temporary
          password provided below to log in to your account and reset your
          password:
        </p>
        <div class="temporary-password">${tempPassword}</div>
        <p>
          For security purposes, this password will expire in 24 hours. Please
          log in and reset your password immediately.
        </p>
        <div class="button">
          <a href="https://example.com/reset-password" target="_blank"
            >Reset Password</a
          >
        </div>
        <p>
          If you did not request this password reset, please ignore this email
          or contact support immediately.
        </p>
        <p>Best regards,<br />Your Company Team</p>
      </div>
      <div class="footer">
        <p>&copy; 2025 Your Company. All rights reserved.</p>
        <p>Your Company Address | Contact: support@example.com</p>
      </div>
    </div>
  </body>
</html>
`;
};
