import { IUser } from "../../domain/entities/user.entities";

export default interface IUserProfileUseCase {
  handleEditmemberData(memberData: IUser): Promise<void | never>;
}
