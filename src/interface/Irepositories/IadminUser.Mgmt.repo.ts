import { Request, Response, NextFunction } from "express";
import { IUser } from "../../domain/entities/user.entities";

export interface IAdminUserMgmtRepo {
  listAllMembers(page: number, pageSize: number): Promise<Partial<IUser[]>>;
  editMember(userDetails: Partial<IUser>): Promise<IUser>;
  blockOrUnblockMember(memberId: string): Promise<void | never>;
  createMember(newMember: IUser): Promise<void | never>;
  doesUserExist(memberId: string): Promise<boolean>;
}
