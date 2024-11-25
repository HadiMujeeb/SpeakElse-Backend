import { Role } from "@prisma/client";
import { HttpStatus } from "../domain/responseStatus/httpcode";
import { ErrorMessages } from "../domain/responseMessages/errorMessages";
import adminRepository from "../infrastructure/repository/admin.repository";
import { PasswordService } from "../domain/services/password.services";
import { IUser } from "../domain/entities/user.entities";
import { JWT } from "../domain/services/jwt.service";
import { IAuthTokens } from "../interface/Icontrollers/Iuser.auth.controller";

export default class AdminUseCase {
  constructor(
    private adminRepository: adminRepository,
    private PasswordService: PasswordService
  ) {
    this.PasswordService = PasswordService;
    this.adminRepository = adminRepository;
  }

  async handleAdminlogin(email: string, password: string): Promise<void | IAuthTokens> {
    try {
      const isAdmin = await this.adminRepository.isAdmin(email);
      if (!isAdmin || isAdmin.role !== Role.ADMIN) {
        throw { status: HttpStatus.NOT_FOUND, message: ErrorMessages.INVALID_CREDENTIALS };
      }
      const isPasswordMatch = await this.PasswordService.verifyPassword(password, isAdmin.password || "");
      if (isPasswordMatch){
        const refreshToken = await JWT.adminRefreshToken(isAdmin.id); 
        const accessToken = await JWT.generateToken(isAdmin.id); 
        return { accessToken, refreshToken }; 
      }
      else throw { status: HttpStatus.BAD_REQUEST, message: ErrorMessages.INVALID_PASSWORD };
    } catch (error) {
      throw error;
    }
  }

  async validateAdminAccessToken(accessToken: string, refreshToken: string): Promise<{ accessToken: string; adminData: IUser | null }> { 
    try {
      // console.log(accessToken,"accessToken");
      // console.log(refreshToken,"refreshToken"); 
      let adminData: IUser | null = null; 
      const decodedToken = await JWT.verifyToken(accessToken); 
      
      if (typeof decodedToken === "object" && decodedToken !== null && "id" in decodedToken){ 
        console.log(decodedToken,"decodedToken");
        adminData = await this.adminRepository.findUserById(decodedToken.id); 
        if (adminData && !adminData.isBlocked) { 
          return { accessToken, adminData }; 
        } else { 
          throw { status: HttpStatus.FORBIDDEN, message: ErrorMessages.USER_BLOCKED }; 
        } 
      } else { 
        console.log("decodedToken");
        const refreshResponse = await this.refreshAccessToken(refreshToken); 
        if (refreshResponse.accessToken) { 
          adminData = await this.adminRepository.findUserById(refreshResponse.userId); 
          if (adminData && !adminData.isBlocked) { 
            return { accessToken: refreshResponse.accessToken, adminData }; 
          } 
        } 
        throw { status: HttpStatus.UNAUTHORIZED, message: ErrorMessages.INVALID_REFRESH_TOKEN }; 
      } 
    } catch (err: any) {
      let adminData: IUser | null = null; 
      if (err.name === "TokenExpiredError") { 
        const refreshResponse = await this.refreshAccessToken(refreshToken); 
        if (refreshResponse.accessToken) { 
          adminData = await this.adminRepository.findUserById(refreshResponse.userId); 
          return { accessToken: refreshResponse.accessToken, adminData }; 
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
        const adminData = await this.adminRepository.findUserById(userId); 
        if (adminData && !adminData.isBlocked) { 
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
