import knex from "knex";

export class AdminUsersModels {
  private db;
  constructor(db: knex.Knex<any, unknown[]>) {
    this.db = db;
  }

  getUserById = async (userId: number) => {
    return await this.db("users")
      .where("user_id", userId)
      .select("username")
      .first();
  };

  getAllUsers = async (query: any) => {
    const data = await this.db("users")
      .select(
        "user_id",
        "user_type",
        "full_name",
        "username",
        "email",
        "gender",
        "phone_number",
        "password_hash",
        "address",
        "city",
        "country",
        "postal_code",
        "date_of_birth",
        "account_verified",
        "created_at"
      )
      .modify((e) => {
        if (query?.search) {
          e.whereRaw("username like ?", [`%${query?.search}%`])
            .orWhereRaw("full_name like ?", [`%${query?.search}%`])
            .orWhereRaw("phone_number like ?", [`%${query?.search}%`])
            .orWhereRaw("email like ?", [`%${query?.search}%`])
            .orWhereRaw("address like ?", [`%${query?.search}%`]);
        }
        if (query?.verified) {
          e.whereRaw("account_verified like ?", [query?.verified]);
        }
        if (query?.user_type) {
          e.whereRaw("user_type like ?", [query?.user_type]);
        }
      })
      .limit(query?.limit || 20)
      .offset(query?.skip || 0);

    const { count } = (await this.db("users")
      .count("user_id as count")
      .modify((e) => {
        if (query?.search) {
          e.whereRaw("username like ?", [`%${query?.search}%`])
            .orWhereRaw("full_name like ?", [`%${query?.search}%`])
            .orWhereRaw("phone_number like ?", [`%${query?.search}%`])
            .orWhereRaw("email like ?", [`%${query?.search}%`])
            .orWhereRaw("address like ?", [`%${query?.search}%`]);
        }
        if (query?.verified) {
          e.whereRaw("account_verified like ?", [query?.verified]);
        }
        if (query?.user_type) {
          e.whereRaw("user_type like ?", [query?.user_type]);
        }
      })
      .first()) as { count: number };

    return { count, data };
  };

  bookingsInfo = async (query: any) => {
    const data = await this.db("booking_info")
      .select(
        "booking_info.id",
        "booking_info.user_id",
        "users.user_type",
        "users.full_name",
        "users.email as user_email",
        "users.phone_number",
        "booking_info.orderNumber",
        "booking_info.CountryCode",
        "booking_info.AreaCode",
        "booking_info.PhoneNumber",
        "booking_info.PostCode",
        "booking_info.bookingStatus",
        "booking_info.pnrId",
        "booking_info.TktTimeLimit",
        "booking_info.baseFare",
        "booking_info.discount",
        "booking_info.appliedCoupon",
        "booking_info.netTotal",
        "booking_info.paymentStatus",
        "booking_info.ticketStatus",
        "booking_info.paymentAt",
        "booking_info.createdAt",
        "booking_info.TraceId"
      )
      .leftJoin("users", "users.user_id", "booking_info.user_id")
      .modify((e) => {
        if (query?.search) {
          e.whereRaw("booking_info.pnrId like ?", [
            `%${query?.search}%`,
          ]).orWhereRaw("users.full_name like ?", [`%${query?.search}%`]);
        }
        if (query?.payment_status) {
          e.whereRaw("booking_info.paymentStatus like ?", [
            query?.payment_status,
          ]);
        }
        if (query?.ticket_status) {
          e.whereRaw("booking_info.ticketStatus like ?", [
            query?.ticket_status,
          ]);
        }
      })
      .orderBy("booking_info.id", "desc")
      .limit(query?.limit || 20)
      .offset(query?.skip || 0);

    const { count } = await this.db("booking_info")
      .count("booking_info.id as count")
      .leftJoin("users", "users.user_id", "booking_info.user_id")
      .modify((e) => {
        if (query?.search) {
          e.whereRaw("booking_info.pnrId like ?", [
            `%${query?.search}%`,
          ]).orWhereRaw("users.full_name like ?", [`%${query?.search}%`]);
        }
        if (query?.payment_status) {
          e.whereRaw("booking_info.paymentStatus like ?", [
            query?.payment_status,
          ]);
        }
        if (query?.ticket_status) {
          e.whereRaw("booking_info.ticketStatus like ?", [
            query?.ticket_status,
          ]);
        }
      })
      .first();

    return { count, data };
  };

  userWiseBookings = async (userId: number) => {
    return await this.db("booking_info")
      .select(
        "booking_info.id",
        "booking_info.user_id",
        "users.user_type",
        "users.full_name",
        "users.email as user_email",
        "users.phone_number",
        "booking_info.orderNumber",
        "booking_info.CountryCode",
        "booking_info.AreaCode",
        "booking_info.PhoneNumber",
        "booking_info.PostCode",
        "booking_info.bookingStatus",
        "booking_info.pnrId",
        "booking_info.TktTimeLimit",
        "booking_info.baseFare",
        "booking_info.discount",
        "booking_info.appliedCoupon",
        "booking_info.netTotal",
        "booking_info.paymentStatus",
        "booking_info.ticketStatus",
        "booking_info.paymentAt",
        "booking_info.createdAt",
        "booking_info.TraceId"
      )
      .leftJoin("users", "users.user_id", "booking_info.user_id")
      .where("booking_info.user_id", userId)
      .orderBy("booking_info.id", "desc");
  };
}
