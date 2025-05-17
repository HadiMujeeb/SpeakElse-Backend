
import { ITransaction } from "./mentor.entities";

export interface IUser {
  id: string;
  email: string;
  password: string | null;
  name: string;
  role?: string | null;
  avatar?: string | null;
  profession?: string | null;
  language?: string | null;
  country?: string | null;
  description?: string | null;
  isVerified?: boolean;
  isBlocked?: boolean;
  resetToken?: string | null;
  comments?: IComment[];
  userWallet?: IuserWallet|null;
  createdAt: Date;
}
// enum Role {
//   USER
//   ADMIN
//   MENTOR
// }
// export interface LoginRequest {
//   Email: string;
//   password: string;
// }

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
  giverName?: string;
  createdAt: Date;

}

export interface IuserRating {
  feedback: string;
  rating: number;
  givenBy:{
    id:string
    name:string,
    avatar:string
  }
  createdAt: Date;
}


export interface IReport {
  id: string;
  reporterId: string;
  reportedId: string;
  content: string | null;
  proof: string|null;
  status:string
}

export interface IResponseReport extends IReport {
  reporter: IUser;
  reported: IUser;
}

export interface IuserWallet {
  id: string;
  userId: string;
  balance: number;
  transactions?: ITransaction[];
}

