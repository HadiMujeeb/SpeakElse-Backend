import { IUser } from "../../domain/entities/user.entities";

export default interface IMentorProfileRepository {
  updateMentorData(MemberData: IUser): Promise<void | never>;
}
