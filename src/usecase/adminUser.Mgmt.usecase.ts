import { IUser } from "../domain/entities/user.entities";
import { IAdminUserMgmtUsecase } from "../interface/Iusecase/IadminUser.Mgmt.usecase";
import { HttpStatus } from "../domain/responseStatus/httpcode";
import { ErrorMessages } from "../domain/responseMessages/errorMessages";
import { PasswordService } from "../domain/services/password.services";

import AdminUserMgmtRepository from "../infrastructure/repository/adminUser.Mgmt.repo";

export default class AdminUserMgmtUseCase implements IAdminUserMgmtUsecase {
  private AdminUserMgmtRepo: AdminUserMgmtRepository;
  private PasswordService: PasswordService;
  constructor(
    AdminUserMgmtRepo: AdminUserMgmtRepository,
    PasswordService: PasswordService
  ) {
    this.AdminUserMgmtRepo = AdminUserMgmtRepo;
    this.PasswordService = PasswordService;
  }
  async addMemberToSystem(newMentor: IUser): Promise<void> {
    try {
      const hashPassword = await this.PasswordService.hashPassword(
        newMentor.password ?? ""
      );
      newMentor.password = hashPassword;
      await this.AdminUserMgmtRepo.createMember(newMentor);
    } catch (error) {
      throw error;
    }
  }

  async retrieveAllMembersList(): Promise<any> {
    try {
      const members = await this.AdminUserMgmtRepo.listAllMembers();
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
      await this.AdminUserMgmtRepo.blockOrUnblockMember(memberId);
    } catch (error) {
      throw error;
    }
  }
  async updateMemberDetails(MemberData: Partial<IUser>): Promise<void | never> {
    try {
      console.log("user data", MemberData);
      let isMemberExist;
      if (MemberData.id) {
        isMemberExist = await this.AdminUserMgmtRepo.doesUserExist(
          MemberData.id
        );
      }

      if (!isMemberExist) {
        throw {
          status: HttpStatus.NOT_FOUND,
          message: ErrorMessages.USER_NOT_FOUND,
        };
      }

      await this.AdminUserMgmtRepo.editMember(MemberData);
    } catch (error) {
      throw error;
    }
  }
}
