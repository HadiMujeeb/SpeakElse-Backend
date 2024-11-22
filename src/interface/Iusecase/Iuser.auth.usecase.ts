import { VoidExpression } from "typescript";
import { ILoginRequest } from "../Icontrollers/Iuser.auth.controller";
import { IRegistrationRequest } from "../Icontrollers/Iuser.auth.controller";
import { IOtpVerification } from "../Icontrollers/Iuser.auth.controller";
import { IUser } from "../../domain/entities/user.entities";
import { IAuthTokens } from "../Icontrollers/Iuser.auth.controller";
export interface IUserAuthUseCase {
  registerUser(newUserData: IRegistrationRequest): Promise<void | never>;
  handleOtpConfirmation( email: string,enteredOtp: string): Promise<IAuthTokens | void>;
  sendVerificationOTP(name: string, email: string): Promise<void | never>;
  resendVerificationOTP(email: string): Promise<void | never>;
  handleUserLogin(credentials: ILoginRequest): Promise<IAuthTokens| void>;
  validateAccessToken(accessToken: string,refreshToken:string): Promise<IUser | {accessToken: string,userData:IUser|null}>;
  refreshAccessToken(refreshToken: string): Promise<{ accessToken: string, userId: string }>
  sentEmailResetPassword(email: string): Promise<void>;
}

export default interface IPasswordTokenCredentials {
  resetToken: string | null;
  resetTokenExpiry: Date | null;
}
export interface ITokenResponse {
  accessToken: string ;
  userData: IUser
}