import { IUserRegisterCredentials } from "../controllers/user.IAuth.controller";
import { IUser } from "../../entities/user";
export default interface IUserAuthRepository {

  createNewUser(newUserData: IUserRegisterCredentials): Promise<void | never>;
  findUserByEmail(email: string): Promise<IUser | null>;
  markUserAsVerified(email: string): Promise<void>;
  findUserById(id:string):Promise<IUser|null>;
  getUserByGoogleId(googleId: string): Promise<IUser | null>
}


