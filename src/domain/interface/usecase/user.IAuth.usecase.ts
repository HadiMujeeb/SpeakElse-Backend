import { VoidExpression } from "typescript";
import { IUserRegisterCredentials } from "../controllers/user.IAuth.controller";
import { IUserLoginCredentials } from "../controllers/user.IAuth.controller";
import { OTPData } from "../controllers/user.IAuth.controller";
export interface IUserAuthUseCase {

    registerUser(newUserData:IUserRegisterCredentials): Promise<void|never>;
    handleOtpConfirmation(sentedData:OTPData): Promise<string | void>
    sendVerificationOTP( name: string,email: string): Promise<void | never>
    handleUserLogin(credentials:IUserLoginCredentials): Promise<void|boolean>;
    validateAccessToken(token:string):Promise<void>
}