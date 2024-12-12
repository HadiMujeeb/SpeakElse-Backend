import { use } from "passport";
import IApplication from "../domain/entities/mentor.entities";
import IMentorAuthUseCase from "../interface/Iusecase/Imentor.auth.usecase";
import { HttpStatus } from "../domain/responseStatus/httpcode";
import { ErrorMessages } from "../domain/responseMessages/errorMessages";
import mentorAuthRepository from "../infrastructure/repository/mentor.Auth.repository";
import { IUser } from "../domain/entities/user.entities";
import { JWT } from "../domain/services/jwt.service";
import { IAuthTokens, ILoginRequest } from "../interface/Icontrollers/Iuser.auth.controller";
import { ApprovalStatus, Role } from "@prisma/client";
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


  async handleMentorLogin(credentials: ILoginRequest): Promise<{ accessToken: string; refreshToken: string } | void> { 
    try { 
      const { email, password } = credentials; 
      const isEmailExisted = await this.MentorAuthRepository.findMentorByEmail(email); 
    if ((isEmailExisted && !isEmailExisted.isVerified) || !isEmailExisted|| isEmailExisted.approvalStatus!==ApprovalStatus.APPROVED) { 
        throw { status: HttpStatus.NOT_FOUND, message: ErrorMessages.MENTOR_NOT_FOUND }; 
      }
      const isPasswordMatch = await this.PasswordService.verifyPassword(password, isEmailExisted.password || ""); 
      if (isPasswordMatch) { 
        
        const refreshToken = await JWT.mentorRefreshToken(isEmailExisted.id); 
        const accessToken = await JWT.generateToken(isEmailExisted.id); 
        return { accessToken, refreshToken }; 
      } else { 
        throw { status: HttpStatus.UNAUTHORIZED, message: ErrorMessages.INVALID_PASSWORD }; 
      } 
    } catch (err) { 
      throw err; 
    } 
  }

  async validateAccessToken(accessToken: string, refreshToken: string): Promise<{ accessToken: string; mentorData: IApplication | null }> { 
    try { 
      let mentorData: IApplication | null = null; 
      const decodedToken = await JWT.verifyToken(accessToken); 
      if (typeof decodedToken === "object" && decodedToken !== null && "id" in decodedToken) { 
        mentorData = await this.MentorAuthRepository.findMentorById(decodedToken.id); 
        console.log(mentorData,"mentorData");
        if (mentorData && !mentorData.isBlocked && mentorData.approvalStatus == ApprovalStatus.APPROVED) { 
          return { accessToken, mentorData }; 
        } else { 
          throw { status: HttpStatus.FORBIDDEN, message: ErrorMessages.USER_BLOCKED }; 
        } 
      } else { 
        const refreshResponse = await this.refreshAccessToken(refreshToken); 
        if (refreshResponse.accessToken) { 
          mentorData = await this.MentorAuthRepository.findMentorById(refreshResponse.userId); 
          if (mentorData && !mentorData.isBlocked) { 
            return { accessToken: refreshResponse.accessToken, mentorData }; 
          } 
        } 
        throw { status: HttpStatus.UNAUTHORIZED, message: ErrorMessages.INVALID_REFRESH_TOKEN }; 
      } 
    } catch (err: any) { 
      let mentorData: IApplication | null = null; 
      if (err.name === "TokenExpiredError") { 
        const refreshResponse = await this.refreshAccessToken(refreshToken); 
        if (refreshResponse.accessToken) { 
          mentorData = await this.MentorAuthRepository.findMentorById(refreshResponse.userId); 
          return { accessToken: refreshResponse.accessToken, mentorData }; 
        } 
        throw { status: HttpStatus.UNAUTHORIZED, message: ErrorMessages.INVALID_REFRESH_TOKEN }; 
      }
      throw { status: HttpStatus.UNAUTHORIZED, message: ErrorMessages.INVALID_TOKEN }; 
    } 
  }

  async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string; userId: string }> { 
    try { 
      const decodedRefreshToken = await JWT.verifyToken(refreshToken); 
      if (typeof decodedRefreshToken === "object" && decodedRefreshToken !== null && "id" in decodedRefreshToken) { 
        const userId = decodedRefreshToken.id; 
        const userData = await this.MentorAuthRepository.findMentorById(userId); 
        if (userData && !userData.isBlocked) { 
          const newAccessToken = JWT.generateToken(userId); 
          return { accessToken: newAccessToken, userId }; 
        } else { 
          throw { status: HttpStatus.FORBIDDEN, message: ErrorMessages.USER_BLOCKED }; 
        } 
      } else { 
        throw { status: HttpStatus.UNAUTHORIZED, message: ErrorMessages.INVALID_REFRESH_TOKEN }; 
      } 
    } catch (error) { 
      throw { status: HttpStatus.UNAUTHORIZED, message: ErrorMessages.INVALID_REFRESH_TOKEN }; 
    } 
  }



  
}
