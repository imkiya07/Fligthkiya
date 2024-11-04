export interface IRegistration {
  full_name: string;
  email: string;
  phone_number: string;
  password: string;
}
export interface IRegistrationDb {
  full_name: string;
  username: string;
  email: string;
  phone_number: string;
  password_hash: string;
}

export interface IAuthUser {
  user_id: number;
  account_verified: number;
  full_name: string;
  username: string;
  email: string;
  phone_number: string;
  address: string;
}
