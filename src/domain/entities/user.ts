export interface User {
  id: string;
  email: string;
  password: string;
  name: string ;
  role?: string | null;
  avatar?: string | null;
  profession?: string | null;
  country?: string | null;
}

export interface LoginRequest {
  Email: string;
  password: string;
}

export interface OTP {
  id: string;
  email: string;
  otp: string;
  expiresAt: Date;
  createdAt: Date;

}
