import { IUser } from "../domain/entities/user";
import { IAdminUserMgmtUsecase } from "../domain/interface/usecase/IAdminUserMgmtusecase";
import { HttpStatus } from "../domain/StatusCodes/HttpStatus";
import { ErrorMessages } from "../domain/StatusMessages/ErrorMessages";
import { PasswordService } from "../domain/thirdParty/passwordServices";

import AdminUserMgmtRepository from "../infrastructure/repositories/AdminUserMgmtRepo";

export default class AdminUserMgmtUseCase implements IAdminUserMgmtUsecase {
    
    private AdminUserMgmtRepo:AdminUserMgmtRepository;
    private PasswordService: PasswordService;
    constructor(AdminUserMgmtRepo:AdminUserMgmtRepository,PasswordService: PasswordService,){
        this.AdminUserMgmtRepo =AdminUserMgmtRepo;
        this.PasswordService = PasswordService;
    }
 async addMemberToSystem(newMentor: IUser): Promise<void> {
     try {
        const hashPassword = await this.PasswordService.hashPassword(newMentor.password??"")
        newMentor.password = hashPassword;
        await this.AdminUserMgmtRepo.createMember(newMentor);

     } catch (error) {
       throw error 
     }
 }   

 async retrieveAllMembersList(): Promise<any> {
     try {
     const members = await this.AdminUserMgmtRepo.listAllMembers()
     if(!members){
        throw {status:HttpStatus.NOT_FOUND,message:ErrorMessages.USER_NOT_FOUND}
     }
     return members
     } catch (error) {
        throw error
     }
 }

 async toggleMemberBlocking(memberId: string): Promise<void | never> {
     try {
        if(!memberId){
            throw {status:HttpStatus.NOT_FOUND,message:ErrorMessages.USER_NOT_FOUND}
        }
        await this.AdminUserMgmtRepo.blockOrUnblockMember(memberId);
     } catch (error) {
        throw error
     }
 }
 async updateMemberDetails(memberId: string, userDetails: Partial<IUser>): Promise<void | never> {
     try {
      const isMemberExist = await this.AdminUserMgmtRepo.doesUserExist(memberId);
     if(!isMemberExist){
        throw {status:HttpStatus.NOT_FOUND,message:ErrorMessages.USER_NOT_FOUND}
     }
     
     await this.AdminUserMgmtRepo.editMember(memberId,userDetails);

     } catch (error) {
        
     }
 }
}