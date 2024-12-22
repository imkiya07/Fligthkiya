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
