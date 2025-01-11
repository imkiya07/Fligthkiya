import knex from "knex";
import { AppError } from "../../core/errors/AppError";
import { IRegistrationDb } from "./authInterfaces";

export class AuthModel {
  private db;

  constructor(db: knex.Knex<any, unknown[]>) {
    this.db = db;
  }

  async isEmailUnique(email: string): Promise<boolean> {
    try {
      const [existingEmail] = await this.db("users")
        .select("email")
        .where("email", email);

      // Return true if email is unique, false if it already exists
      return !existingEmail;
    } catch (error) {
      console.error("Error checking email uniqueness:", error);
      throw new Error("Email uniqueness check failed");
    }
  }

  // Register a new user
  async registerUser(payload: IRegistrationDb) {
    try {
      const [userId] = await this.db("users").insert(payload);

      return userId;
    } catch (error) {
      throw new AppError("Error registering user:", 400);
    }
  }

  setVerifyToken = async (
    user_id: number,
    reset_token: string,
    reset_expires: any
  ) => {
    await this.db("verify_tokens")
      .insert({
        user_id,
        reset_token,
        reset_expires,
      })
      .onConflict("user_id")
      .merge();
  };

  getVerifyToken = async (user_id: number) => {
    return (await this.db("verify_tokens")
      .select("*")
      .where({ user_id })
      .first()) as {
      user_id: number;
      reset_token: string;
      reset_expires: any;
    };
  };

  // Mark user profile as verified
  public verifyUserProfile = async (user_id: number) => {
    await this.db("users").where({ user_id }).update({ account_verified: 1 });
  };

  // Login user
  async getUserByEmail(email: string) {
    try {
      return (await this.db("users")
        .select(
          "user_id",
          "account_verified",
          "full_name",
          "username",
          "email",
          "phone_number",
          "password_hash",
          "profile_picture"
        )
        .where({ email })
        .orWhere("username", email)
        .first()) as {
        user_id: number;
        account_verified: number;
        full_name: string;
        username: string;
        email: string;
        phone_number: string;
        password_hash: string;
      };
    } catch (error) {
      throw new AppError("Error logging in user", 400);
    }
  }

  // Verify user account (could be for email verification)
  async verifyAccount(userId: number) {
    try {
      const result = await this.db("users")
        .where({ user_id: userId })
        .update({ account_verified: 1 });

      return result > 0
        ? { success: true }
        : { success: false, error: "Verification failed" };
    } catch (error) {
      console.error("Error verifying account:", error);
      return { success: false, error: "Verification failed" };
    }
  }

  // Fetch user by ID
  async getUserById(userId: number) {
    try {
      return await this.db("users")
        .select(
          "full_name",
          "username",
          "email",
          "phone_number",
          "address",
          "city",
          "country",
          "postal_code",
          "date_of_birth",
          "passport_number",
          "nationality",
          "login_method",
          "social_id",
          "social_provider",
          "social_token",
          "profile_picture",
          "account_verified"
        )
        .where({ user_id: userId })
        .first();
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      return { success: false, error: "User fetch failed" };
    }
  }
}
