import crypto from "crypto";
import dayjs from "dayjs";
import { Request } from "express";
import nodemailer from "nodemailer";
import AbstractServices from "../../core/abstract/abstract.services";
import {
  passwordUpdatedTemplate,
  resetPassTemplate,
} from "../../core/common/emailTemplate";
import { AdminAuthModels } from "../admin/auth/adminAuth.model";
import { AuthModel } from "./AuthModel";
import { IRegistration } from "./authInterfaces";
import { generateToken } from "./authUtils";

// Function to hash the password
export function hashPassword(password: string) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

// Function to verify the password
export function verifyPassword(inputPassword: string, storedHash: string) {
  const inputHash = hashPassword(inputPassword); // Hash the input password
  return inputHash === storedHash; // Compare with the stored hash
}

export class AuthServices extends AbstractServices {
  constructor() {
    super();
  }

  // REGISTRATION USER
  registrationUser = async (req: Request) => {
    const conn = new AuthModel(this.db);

    const { email, full_name, password, phone_number } =
      req.body as IRegistration;

    const isUnique = await conn.isEmailUnique(email);

    if (!isUnique) {
      throw this.throwError("Email Address Already in Use", 400);
    }

    const password_hash = hashPassword(password);

    const nameParts = full_name.toLowerCase().trim().split(" ");
    const uniqueSuffix = Math.floor(10000 + Math.random() * 90000);

    let username = nameParts[0] + uniqueSuffix;

    const user_id = await conn.registerUser({
      email,
      full_name,
      password_hash,
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

    return {
      success: true,
      message: "User registration successfully",
      token,
      data: { user_id, email, username, full_name, phone_number },
    };
  };

  /**
   * LOGIN USER
   * @param req
   * @returns
   */
  loginUser = async (req: Request) => {
    const conn = new AuthModel(this.db);

    const { username, password } = req.body as {
      username: string;
      password: string;
    };

    const user = await conn.getUserByEmail(username);

    if (!user) {
      throw this.throwError("User does't exist", 404);
    }

    const { password_hash, ...restData } = user;

    const verify = verifyPassword(password, password_hash);

    if (!verify) {
      throw this.throwError("Invalid email or password", 401);
    }

    const token = generateToken({
      user_id: user?.user_id,
      full_name: user?.full_name,
      username: user?.username,
      email: user?.email,
      account_verified: user?.account_verified,
    });

    return { success: true, token, data: restData };
  };

  /**
   * @LoginAdmin
   */
  loginAdmin = async (req: Request) => {
    const body = req.body as { username: string; password: string };

    const conn = new AdminAuthModels(this.db);

    const admin = await conn.getAdminUser(body.username);

    if (!admin) {
      throw this.throwError("Invalid username or password", 401);
    }

    const { password_hash, ...restData } = admin;

    const verify = verifyPassword(body.password, password_hash);

    if (!verify) {
      throw this.throwError("Invalid email or password", 401);
    }

    const token = generateToken(restData);

    return {
      success: true,
      message: "Admin login successfully",
      data: { token, ...restData },
    };
  };

  /**
   * REFRESH TOKEN
   * @param req
   * @returns
   */
  refreshToken = async (req: Request) => {
    const conn = new AuthModel(this.db);

    const data = await conn.getUserById(req?.user_id);

    return { success: true, data };
  };

  // REQUEST PASSWORD RESET
  public requestPasswordReset = async (req: Request) => {
    const { email } = req.body;
    const conn = new AuthModel(this.db);

    const user = await conn.getUserByEmail(email);

    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    // Generate reset token
    const resetToken = generateFiveDigitCode();
    const resetExpires = Date.now() + 3600000; // 1 hour
    const resetExpiresFormatted = toMySQLDateTime(resetExpires);

    // Store the reset token and expiration time in the database
    await conn.setVerifyToken(user.user_id, resetToken, resetExpiresFormatted);

    const transporter = nodemailer.createTransport({
      service: "Gmail", // Or another SMTP service
      auth: {
        user: process.env.EMAIL_SEND_EMAIL_ID,
        pass: process.env.EMAIL_SEND_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"Flight kiya" <${process.env.EMAIL_SEND_EMAIL_ID}>`,
      to: email,
      subject: "Password Reset Request",
      html: resetPassTemplate(
        user.full_name,
        resetToken,
        process.env.CL_BASE_URL as string
      ),
    };

    await transporter.sendMail(mailOptions);

    return {
      success: true,
      message: "Password reset email sent",
    };
  };

  // RESET PASSWORD
  public resetPassword = async (req: Request) => {
    const { token } = req.params;
    const { newPassword, email } = req.body;

    const conn = new AuthModel(this.db);

    const user = await conn.getUserByEmail(email);

    // Verify token
    const tokenInfo = await conn.getVerifyToken(user.user_id);

    if (
      !tokenInfo ||
      tokenInfo.reset_expires < Date.now() ||
      tokenInfo.reset_token !== token
    ) {
      return {
        success: false,
        message: "Token is invalid or expired",
      };
    }

    const transporter = nodemailer.createTransport({
      service: "Gmail", // Or another SMTP service
      auth: {
        user: process.env.EMAIL_SEND_EMAIL_ID,
        pass: process.env.EMAIL_SEND_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"Flight kiya" <${process.env.EMAIL_SEND_EMAIL_ID}>`,
      to: email,
      subject: "Your password has been updated",
      html: passwordUpdatedTemplate(
        user.full_name,
        process.env.CL_BASE_URL as string
      ),
    };

    await transporter.sendMail(mailOptions);

    // Hash the new password and save it
    const password_hash = hashPassword(newPassword);

    await this.db("users")
      .update({ password_hash })
      .where({ user_id: user?.user_id });

    return {
      success: true,
      message: "Password reset successfully",
    };
  };
}

export const toMySQLDateTime = (timestamp: number): string => {
  return dayjs(timestamp).format("YYYY-MM-DD HH:mm:ss");
};

export const generateFiveDigitCode = (): string => {
  return Math.floor(10000 + Math.random() * 90000).toString();
};
