import IApplication from "../../domain/entities/mentor.entities";
import { IComment, IUser } from "../../domain/entities/user.entities";

export default interface IMentorProfileUseCase {
  handleEditmentorData(mentorData: IUser): Promise<IApplication>;
  getfeedbackRatings(mentorId: string): Promise<IComment[]>
}
