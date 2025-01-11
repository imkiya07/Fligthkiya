export interface IUpdateBookingBody {
  booking_id: number;
  request_type: "REFUND" | "VOID" | "REISSUE";
  reason: string;
  remarks: string;
}

export interface IUpdateBookingDB extends IUpdateBookingBody {
  user_id: number;
}
export interface IAdminBookingUpdateDb {
  amount: string;
  status: "pending" | "approved" | "rejected";
  admin_comments: string;
}

export interface IUserUpdateBody {
  full_name: string;
  email: string;
  gender: string;
  phone_number: string;
  address: string;
  city: string;
  country: string;
  postal_code: string;
  date_of_birth: string;
  passport_number: string;
  nationality: string;
}
