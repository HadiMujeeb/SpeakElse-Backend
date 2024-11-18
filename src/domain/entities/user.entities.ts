import { Role } from "@prisma/client";

export interface IUser {
  id: string;
  email: string;
  password: string | null;
  name: string;
  role?: Role;
  avatar?: string | null;
  profession?: string | null;
  language?: string | null;
  country?: string | null;
  description?: string | null;
  isVerified?: boolean;
  isBlocked?: boolean;
  resetToken?: string | null;
  comments?: IComment[];
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

export interface IComment {
  userId: string;
  feedback: string;
  rating: number;
  givenBy: string;
}
