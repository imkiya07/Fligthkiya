import { Request } from "express";
import AbstractServices from "../../../core/abstract/abstract.services";
import { hashPassword, verifyPassword } from "../../auth/authServices";
import { generateToken } from "../../auth/authUtils";
import { IAddAdminBody, IAdminUserDb } from "./adminAuth.interface";
import { AdminAuthModels } from "./adminAuth.model";

export class AdminAuthServices extends AbstractServices {
  constructor() {
    super();
  }

  /**
   * @CreateAdmin
   */
  createAdmin = async (req: Request) => {
    const { email, full_name, password, phone_number, username } =
      req.body as IAddAdminBody;

    const conn = new AdminAuthModels(this.db);

    const isExistEmail = await conn.getAdminUser(email);
    if (isExistEmail) {
      throw this.throwError("Email already exist", 400);
    }

    const isExistUsername = await conn.getAdminUser(username);
    if (isExistUsername) {
      throw this.throwError("Username already exist", 400);
    }

    const password_hash = hashPassword(password);

    const payload: IAdminUserDb = {
      email,
      full_name,
      password_hash,
      phone_number,
      user_type: "ADMIN",
      username,
    };

    const id = await conn.insertAdmin(payload);

    return {
      success: true,
      message: "Admin created successfully",
      data: { id, username },
    };
  };
}
