import { IUser } from "../domain/entities/user.entities";
import { IAdminUserMgmtUsecase } from "../interface/Iusecase/IadminUser.Mgmt.usecase";
import { HttpStatus } from "../domain/responseStatus/httpcode";
import { ErrorMessages } from "../domain/responseMessages/errorMessages";
import { PasswordService } from "../domain/services/password.services";
import adminUserMgmtRepository from "../infrastructure/repository/adminUser.Mgmt.repo";
import { IMember, IResponseAdminAddMember } from "../domain/entities/admin.entities";

export default class adminUserMgmtUseCase implements IAdminUserMgmtUsecase {
  private adminUserMgmtRepository: adminUserMgmtRepository;
  private PasswordService: PasswordService;
  constructor(
    AdminUserMgmtRepo: adminUserMgmtRepository,
    PasswordService: PasswordService
  ) {
    this.adminUserMgmtRepository = AdminUserMgmtRepo;
    this.PasswordService = PasswordService;
  }
  async addMemberToSystem(newMentor: IMember): Promise<void|IResponseAdminAddMember> {
    try {
      const hashPassword = await this.PasswordService.hashPassword(
        newMentor.password ?? ""
      );
      newMentor.password = hashPassword;
      const data =await this.adminUserMgmtRepository.createMember(newMentor);
      return data
    } catch (error) {
      throw error;
    }
  }

  async retrieveAllMembersList(): Promise<any> {
    try {
      const members = await this.adminUserMgmtRepository.listAllMembers();
      return members
    } catch (error) {
      throw error;
    }
  }
  

  async toggleMemberBlocking(memberId: string): Promise<void | never> {
    try {
      if (!memberId) {
        throw {
          status: HttpStatus.NOT_FOUND,
          message: ErrorMessages.USER_NOT_FOUND,
        };
      }
      await this.adminUserMgmtRepository.blockOrUnblockMember(memberId);
    } catch (error) {
      throw error;
    }
  }
  async updateMemberDetails(MemberData: Partial<IUser>): Promise<void | never> {
    try {
      console.log("user data", MemberData);
      let isMemberExist;
      if (MemberData.id) {
        isMemberExist = await this.adminUserMgmtRepository.doesUserExist(
          MemberData.id
        );
      }

      if (!isMemberExist) {
        throw {
          status: HttpStatus.NOT_FOUND,
          message: ErrorMessages.USER_NOT_FOUND,
        };
      }

      await this.adminUserMgmtRepository.editMember(MemberData);
    } catch (error) {
      throw error;
    }
  }
}
