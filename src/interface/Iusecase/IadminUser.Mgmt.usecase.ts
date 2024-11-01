import { IUser } from "../../domain/entities/user.entities";

export interface IAdminUserMgmtUsecase {
  addMemberToSystem(newMentor: IUser): Promise<void>;
  updateMemberDetails(MemberData: Partial<IUser>): Promise<void | never>;
  toggleMemberBlocking(memberId: string): Promise<void | never>;
  retrieveAllMembersList(): Promise<IUser[]>;
}
