import bcrypt from "bcrypt";
import { Request } from "express";
import AbstractServices from "../../core/abstract/abstract.services";
import { AuthModel } from "./AuthModel";
import { IRegistration } from "./authInterfaces";
import { generateToken } from "./authUtils";

export class AuthServices extends AbstractServices {
  constructor() {
    super();
  }

  registrationUser = async (req: Request) => {
    const conn = new AuthModel(this.db);

    const { email, full_name, password, phone_number } =
      req.body as IRegistration;

    const isUnique = await conn.isEmailUnique(email);

    if (!isUnique) {
      throw this.throwError("Email Address Already in Use", 400);
    }

    const password_hash = await bcrypt.hash(password, 10);

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

  loginUser = async (req: Request) => {
    const conn = new AuthModel(this.db);

    const { username, password } = req.body as {
      username: string;
      password: string;
    };

    const response = await conn.loginUser(username, password);

    if (!response.success) {
      this.throwError(response.error as string, 401);
    }

    const { password_hash, ...restData } = response?.data;

    const token = generateToken(restData);

    return { success: true, token, data: restData };
  };

  refreshToken = async (req: Request) => {
    const conn = new AuthModel(this.db);

    const data = await conn.getUserById(req?.user_id);

    return { success: true, data };
  };
}
