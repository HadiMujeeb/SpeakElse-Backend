export interface IUser {
  id: string;
  email: string;
  password: string | null; 
  name: string;
  role?: string | null;
  googleId?: string | null;
  avatar?: string | null;
  profession?: string | null;
  country?: string | null;
  isVerified?: Boolean;
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
