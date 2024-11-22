import { Role } from "@prisma/client";
import { HttpStatus } from "../domain/responseStatus/httpcode";
import { ErrorMessages } from "../domain/responseMessages/errorMessages";
import adminRepository from "../infrastructure/repository/admin.repository";
import { PasswordService } from "../domain/services/password.services";
import { IUser } from "../domain/entities/user.entities";

export default class AdminUseCase {
  constructor(
    private adminRepository: adminRepository,
    private PasswordService: PasswordService
  ) {
    this.PasswordService = PasswordService;
    this.adminRepository = adminRepository;
  }
  // async isAdmin(email: string): Promise<boolean> {
  //     return this.adminRepository.isAdmin(email);
  // }
  // async adminExists(email: string): Promise<boolean> {
  //     return this.adminRepository.adminExists(email);
  // }

  // async verifyPassword(email: string, password: string): Promise<boolean> {
  //     return this.adminRepository.verifyPassword(email, password);
  // }

  async handleAdminlogin(
    email: string,
    password: string
  ): Promise<void | IUser> {
    try {
      const isAdmin = await this.adminRepository.isAdmin(email);
      if (!isAdmin || isAdmin.role !== Role.ADMIN) {
        throw {
          status: HttpStatus.NOT_FOUND,
          message: ErrorMessages.INVALID_CREDENTIALS,
        };
      }
      const isPasswordMatch = await this.PasswordService.verifyPassword(
        password,
        isAdmin.password || ""
      );
      if (isPasswordMatch) {
        return isAdmin;
      } else {
        throw {
          status: HttpStatus.BAD_REQUEST,
          message: ErrorMessages.INVALID_PASSWORD,
        };
      }
    } catch (error) {
      throw error;
    }
  }
}
