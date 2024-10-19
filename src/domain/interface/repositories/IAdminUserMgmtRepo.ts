import { Request,Response,NextFunction } from "express";
import { IUser } from "../../entities/user";

export interface IAdminUserMgmtRepo {
    listAllMembers(): Promise<Partial<IUser[]>>;   
    editMember(memberId: string, userDetails: Partial<IUser>): Promise<IUser>;
    blockOrUnblockMember(memberId:string):Promise<void|never>
    createMember(newMember: IUser): Promise<void|never>;
    doesUserExist(memberId: string): Promise<boolean>
}