import IApplication from "../../domain/entities/mentor.entities";
import { IUser } from "../../domain/entities/user.entities";
import { IAuthTokens, ILoginRequest } from "../Icontrollers/Iuser.auth.controller";

export interface IMentorAuthUseCase {
  registerMentorApplication(credentials: IApplication): Promise<void>;
  handleMentorLogin(credentials: ILoginRequest): Promise<{ accessToken: string; refreshToken: string } | void>;

  
}
