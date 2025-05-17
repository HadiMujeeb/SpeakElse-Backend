import { IMember, IResponseAdminAddMember } from "../../domain/entities/admin.entities";
import {  IUser } from "../../domain/entities/user.entities";

export interface IAdminUserMgmtRepo {
  listAllMembers(page: number, pageSize: number): Promise<Partial<IUser[]>>;
  editMember(userDetails: Partial<IUser>): Promise<IUser>;
  blockOrUnblockMember(memberId: string): Promise<void | never>;
  createMember(newMember: IMember): Promise<void | IResponseAdminAddMember>;
  doesUserExist(memberId: string): Promise<boolean>;
}
