import { Role } from "@prisma/client";

export interface IUser {
  id: string;                       
  email: string;                    
  password: string | null;          
  name: string;                     
  role?: Role;                      
  googleId?: string | null;         
  avatar?: string | null;           
  profession?: string | null;       
  country?: string | null;          
  description?: string | null;      
  isVerified?: boolean;             
  isBlocked?: boolean;              
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
