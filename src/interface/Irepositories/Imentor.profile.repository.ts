import IApplication from "../../domain/entities/mentor.entities";
import { IComment, IUser } from "../../domain/entities/user.entities";

export default interface IMentorProfileRepository {
  updateMentorData(MentorData: IApplication): Promise<IApplication>;
  getfeedbackRatings(mentorId: string): Promise<IComment[]>;
}
