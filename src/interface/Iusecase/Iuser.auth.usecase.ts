import { VoidExpression } from "typescript";
import { IUserRegisterCredentials } from "../Icontrollers/Iuser.auth.controller";
import { IUserLoginCredentials } from "../Icontrollers/Iuser.auth.controller";
import { IOTPData } from "../Icontrollers/Iuser.auth.controller";
import { IUser } from "../../domain/entities/user.entities";
export interface IUserAuthUseCase {
  registerUser(newUserData: IUserRegisterCredentials): Promise<void | never>;
  handleOtpConfirmation(
    email: string,
    enteredOtp: string
  ): Promise<string | void>;
  sendVerificationOTP(name: string, email: string): Promise<void | never>;
  resendVerificationOTP(email: string): Promise<void | never>;
  handleUserLogin(credentials: IUserLoginCredentials): Promise<string | void>;
  validateAccessToken(token: string): Promise<IUser | null>;
  sentEmailResetPassword(email: string): Promise<void>;
}

export default interface IPasswordTokenCredentials {
  resetToken: string | null;
  resetTokenExpiry: Date | null;
}
