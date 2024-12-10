import IApplication from "../../domain/entities/mentor.entities";
import { IComment, IUser } from "../../domain/entities/user.entities";

export default interface IMentorAuthRepository {
  createMentorshipApplication(data: IApplication): Promise<void>;
}
