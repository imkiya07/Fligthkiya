import { Request } from "express";
import nodemailer from "nodemailer";
import AbstractServices from "../../../core/abstract/abstract.services";
import { verifyEmailTemplate } from "../../../core/common/emailTemplate";
import { removeFile } from "../../../core/multer/multer";
import { AuthModel } from "../../auth/AuthModel";
import {
  generateFiveDigitCode,
  toMySQLDateTime,
} from "../../auth/authServices";
import { IUpdateBookingBody, IUpdateBookingDB } from "./b2cUsers.interface";
import { B2cUsersModel } from "./b2cUsers.models";

export class B2cUsersServices extends AbstractServices {
  constructor() {
    super();
  }

  // BOOKING REQUEST
  getBookings = async (req: Request) => {
    const conn = new B2cUsersModel(this.db);

    const data = await conn.getBookings(req.user_id);

    return {
      success: true,
      message: "Booking details",
      data,
    };
  };

  addCancelBooking = async (req: Request) => {
    const body = req.body as IUpdateBookingBody;

    const conn = new B2cUsersModel(this.db);

    const payload: IUpdateBookingDB = { ...body, user_id: req.user_id };

    await conn.insertUpdateBooking(payload);

    await conn.updateBookingInfo("CANCEL_PENDING", body.booking_id);

    return {
      success: true,
      message: "Booking update request successfully",
    };
  };

  getCancelBooking = async (req: Request) => {
    const conn = new B2cUsersModel(this.db);

    const { limit, skip, req_type, status } = req.query as {
      limit: string;
      skip: string;
      req_type: string;
      status: string;
    };

    const data = await conn.getUpdateBooking(
      +limit,
      +skip,
      req_type,
      status,
      req.user_id
    );

    return {
      success: true,
      ...data,
    };
  };

  // Update user profile
  public updateUserProfile = async (req: Request) => {
    const { user_id } = req;

    const {
      full_name,
      gender,
      phone_number,
      address,
      city,
      country,
      postal_code,
      date_of_birth,
      passport_number,
      nationality,
    } = req.body;

    const user = await this.db("users")
      .select("user_id")
      .where({ user_id })
      .first();

    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    const updatedFields = {
      full_name,
      gender,
      phone_number,
      address,
      city,
      country,
      postal_code,
      date_of_birth,
      passport_number,
      nationality,
    };

    await this.db("users").where({ user_id }).update(updatedFields);

    return {
      success: true,
      message: "User profile updated successfully",
      data: {
        user_id,
        ...updatedFields,
      },
    };
  };

  // get user profile
  public getProfileInfo = async (req: Request) => {
    const { user_id } = req;

    const user = await this.db("users")
      .select(
        "full_name",
        "email",
        "gender",
        "phone_number",
        "address",
        "city",
        "country",
        "postal_code",
        "date_of_birth",
        "passport_number",
        "profile_picture",
        "nationality"
      )
      .where({ user_id })
      .first();

    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    // removeFile("30img1736506368168-profile.jpeg");

    return {
      success: true,
      message: "User profile",
      data: user,
    };
  };

  // Update profile picture
  public updateProfilePicture = async (user_id: number, imgUrl: string) => {
    const user = await this.db("users").select("*").where({ user_id }).first();

    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    if (user?.profile_picture) removeFile(user?.profile_picture);

    await this.db("users").where({ user_id }).update({
      profile_picture: imgUrl,
    });

    return {
      success: true,
      message: "Profile picture updated successfully",
      data: {
        user_id,
        profile_picture: imgUrl,
      },
    };
  };

  /**
   * VERIFICATION EMAIL
   * @param user_id
   * @param email
   * @returns
   */
  public sendVerificationEmail = async (req: Request) => {
    // Generate reset token
    const resetToken = generateFiveDigitCode();
    const resetExpires = Date.now() + 3600000; // 1 hour
    const resetExpiresFormatted = toMySQLDateTime(resetExpires);

    const { user_id } = req;

    const conn = new AuthModel(this.db);

    // Store verification token in the database
    await conn.setVerifyToken(user_id, resetToken, resetExpiresFormatted);

    const transporter = nodemailer.createTransport({
      service: "Gmail", // Or another SMTP service
      auth: {
        user: process.env.EMAIL_SEND_EMAIL_ID,
        pass: process.env.EMAIL_SEND_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"Flight kiya" <${process.env.EMAIL_SEND_EMAIL_ID}>`,
      to: req.user.email,
      subject: "Profile Verification",
      html: verifyEmailTemplate(
        req.user.full_name,
        resetToken,
        process.env.CL_BASE_URL as string
      ),
    };

    await transporter.sendMail(mailOptions);

    return {
      success: true,
      message: "Verification email sent",
    };
  };

  public verifyProfile = async (req: Request) => {
    const { token } = req.params;
    const conn = new AuthModel(this.db);

    // Verify token
    const tokenInfo = await conn.getVerifyToken(req.user_id);

    if (
      !tokenInfo ||
      tokenInfo.reset_expires < Date.now() ||
      tokenInfo.reset_token !== token
    ) {
      return {
        success: false,
        message: "Invalid or expired verification token",
      };
    }

    // Mark the user's profile as verified
    await conn.verifyUserProfile(req.user_id);

    return {
      success: true,
      message: "Profile verified successfully",
    };
  };
}
