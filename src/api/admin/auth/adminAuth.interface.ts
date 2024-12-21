export interface IAddAdminBody {
  username: string;
  password: string;
  full_name: string;
  email: string;
  phone_number: string;
}
export interface IAdminUserDb {
  user_type: "ADMIN";
  full_name: string;
  username: string;
  email: string;
  phone_number: string;
  password_hash: string;
}
