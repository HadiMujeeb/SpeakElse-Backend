import IApplication from "../../domain/entities/mentor.entities";
import { IComment } from "../../domain/entities/user.entities";

export interface IMentorProfileRepository {
  updateMentorData(MentorData: IApplication): Promise<IApplication>;
  getfeedbackRatings(mentorId: string): Promise<IComment[]>;
}
