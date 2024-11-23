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
          "password_hash"
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
