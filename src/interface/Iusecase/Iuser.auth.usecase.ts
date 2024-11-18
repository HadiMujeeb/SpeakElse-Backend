import { VoidExpression } from "typescript";
import { IUserRegisterCredentials } from "../Icontrollers/Iuser.auth.controller";
import { IUserLoginCredentials } from "../Icontrollers/Iuser.auth.controller";
import { IOTPData } from "../Icontrollers/Iuser.auth.controller";
import { IUser } from "../../domain/entities/user.entities";
import { TokenResponse } from "../Icontrollers/Iuser.auth.controller";
export interface IUserAuthUseCase {
  registerUser(newUserData: IUserRegisterCredentials): Promise<void | never>;
  handleOtpConfirmation( email: string,enteredOtp: string): Promise<TokenResponse | void>;
  sendVerificationOTP(name: string, email: string): Promise<void | never>;
  resendVerificationOTP(email: string): Promise<void | never>;
  handleUserLogin(credentials: IUserLoginCredentials): Promise<TokenResponse| void>;
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