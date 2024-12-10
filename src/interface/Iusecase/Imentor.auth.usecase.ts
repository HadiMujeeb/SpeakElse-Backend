import IApplication from "../../domain/entities/mentor.entities";
import { IUser } from "../../domain/entities/user.entities";
import { IAuthTokens } from "../Icontrollers/Iuser.auth.controller";

export default interface IMentorAuthUseCase {
  registerMentorApplication(credentials: IApplication): Promise<void>;

  
}
