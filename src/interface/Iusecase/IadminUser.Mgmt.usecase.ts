import { IMember, IResponseAdminAddMember } from "../../domain/entities/admin.entities";
import { IUser } from "../../domain/entities/user.entities";

export interface IAdminUserMgmtUsecase {
  addMemberToSystem(newMentor: IMember): Promise<void|IResponseAdminAddMember>;
  updateMemberDetails(MemberData: Partial<IUser>): Promise<void | never>;
  toggleMemberBlocking(memberId: string): Promise<void | never>;
  retrieveAllMembersList(page: number, pageSize: number): Promise<IUser[]>;
}
