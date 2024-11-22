import { IUser } from "../../domain/entities/user.entities";

export default interface IMentorProfileUseCase {
  handleEditmentorData(mentorData: IUser): Promise<void | never>;
}
