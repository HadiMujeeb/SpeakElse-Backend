import { Request, Response, NextFunction } from "express";
import { IUser } from "../../domain/entities/user.entities";

export interface IuserAuthenticationController {
  userRegistrationRequest(req: Request, res: Response, next: NextFunction): Promise<void>;
  confirmOtpRequest(req: Request, res: Response, next: NextFunction): Promise<void>;
  userLoginRequest(req: Request, res: Response, next: NextFunction): Promise<void>;
  userLogoutRequest(req: Request, res: Response, next: NextFunction): Promise<void>;
  authenticateTokenRequest(req: Request, res: Response, next: NextFunction): Promise<IUser | void>;
  resendOTPRequest(req: Request, res: Response, next: NextFunction): Promise<void | never>;
  requestSentMailResetPassword(req: Request, res: Response, next: NextFunction): Promise<void | never>;
  requestResetPassword(req: Request, res: Response, next: NextFunction): Promise<void | never>;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IRegistrationRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface IOtpVerification {
  email: string;
  enteredotp: string;
}

export interface IAuthTokens {
  accessToken: string;
  refreshToken: string;
}