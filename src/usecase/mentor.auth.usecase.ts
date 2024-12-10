import { use } from "passport";
import IApplication from "../domain/entities/mentor.entities";
import IMentorAuthUseCase from "../interface/Iusecase/Imentor.auth.usecase";
import { HttpStatus } from "../domain/responseStatus/httpcode";
import { ErrorMessages } from "../domain/responseMessages/errorMessages";
import mentorAuthRepository from "../infrastructure/repository/mentor.Auth.repository";
import { IUser } from "../domain/entities/user.entities";
import { JWT } from "../domain/services/jwt.service";
import { IAuthTokens } from "../interface/Icontrollers/Iuser.auth.controller";
import { Role } from "@prisma/client";
import { PasswordService } from "../domain/services/password.services";

export default class MentorAuthUseCase implements IMentorAuthUseCase {
  private MentorAuthRepository: mentorAuthRepository;
  private PasswordService: PasswordService
  constructor(MentorAuthRepository: mentorAuthRepository, PasswordService: PasswordService) {
    this.PasswordService = PasswordService
    this.MentorAuthRepository = MentorAuthRepository;
  }

  async registerMentorApplication(credentials: IApplication): Promise<void> {
    try {
      credentials.password = await this.PasswordService.hashPassword(credentials.password);
      await this.MentorAuthRepository.createMentorshipApplication(credentials);
    } catch (error) {
      throw error;
    }
  }



  
}
