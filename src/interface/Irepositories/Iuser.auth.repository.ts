
import { IUser } from "../../domain/entities/user.entities";
import { IRegistrationRequest } from "../Icontrollers/Iuser.auth.controller";
import {IPasswordTokenCredentials, IOTPCredentials } from "../Iusecase/Iuser.auth.usecase";
export interface IUserAuthRepository {
  createNewUser(newUserData: IRegistrationRequest): Promise<void | never>;
  findUserByEmail(email: string): Promise<IUser | null>;
  markUserAsVerified(email: string): Promise<void>;
  findUserById(id: string): Promise<IUser | void>;
  saveOTPForEmail(OtpData: IOTPCredentials): Promise<void | never>;
  findOTPByEmail(email: string): Promise<{otp: string; expiresAt: Date }|void>;
  removeOTPByEmail(email: string): Promise<void | never>;
  saveResetToken(email: string, token: string, expiresAt: Date): Promise<void>;
  findResetToken(email: string): Promise<IPasswordTokenCredentials | null>;
  removeResetToken(email: string): Promise<void>;
  findUserIsExist(email:string):Promise<boolean>
}
