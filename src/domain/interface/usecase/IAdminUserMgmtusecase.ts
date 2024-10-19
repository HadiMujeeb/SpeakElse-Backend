import { IUser } from "../../entities/user";


export interface IAdminUserMgmtUsecase {
    addMemberToSystem(newMentor: IUser): Promise<void>; 
    updateMemberDetails(memberId: string, userDetails: Partial<IUser>): Promise<void|never>; 
    toggleMemberBlocking(memberId: string): Promise<void|never>;
    retrieveAllMembersList(): Promise<IUser[]>;
}
