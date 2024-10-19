import { VoidExpression } from "typescript";
import { IUserRegisterCredentials } from "../controllers/user.IAuth.controller";
import { IUserLoginCredentials } from "../controllers/user.IAuth.controller";
import { IOTPData } from "../controllers/user.IAuth.controller";
import { IUser } from "../../entities/user";
export interface IUserAuthUseCase {

    registerUser(newUserData:IUserRegisterCredentials): Promise<void|never>;
    handleOtpConfirmation(email:string,enteredOtp:string): Promise<string | void>
    sendVerificationOTP( name: string,email: string): Promise<void | never>;
    resendVerificationOTP(email: string): Promise<void | never> ;
    handleUserLogin(credentials:IUserLoginCredentials): Promise<string|void>;
    validateAccessToken(token:string):Promise<IUser|null>;
    sentEmailResetPassword(email:string):Promise<void>;
}

export default interface IPasswordTokenCredentials {
    resetToken: string|null;
    resetTokenExpiry: Date|null;
  }
  