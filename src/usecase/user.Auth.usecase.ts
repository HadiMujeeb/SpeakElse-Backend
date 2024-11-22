import {  IUserAuthUseCase } from "../interface/Iusecase/Iuser.auth.usecase"; 
import { IAuthTokens, ILoginRequest, IRegistrationRequest } from "../interface/Icontrollers/Iuser.auth.controller"; 
import IOTPCredentials from "../interface/Icontrollers/IOTP.controller"; 
import { IUser } from "../domain/entities/user.entities"; 
import OTPRepository from "../infrastructure/repository/Otp.Repository"; 
import { userAuthRepository } from "../infrastructure/repository/user.Auth.repository"; 
import { MailerServices } from "../domain/services/email.service"; 
import { JWT } from "../domain/services/jwt.service"; 
import { PasswordService } from "../domain/services/password.services"; 
import { generateOTP } from "../domain/utils/generateOTP.util"; 
import { HttpStatus } from "../domain/responseStatus/httpcode"; 
import { ErrorMessages } from "../domain/responseMessages/errorMessages";  

export default class UserAuthUseCase implements IUserAuthUseCase { 
  private UserAuthRepository: userAuthRepository; 
  private OTPRepository: OTPRepository; 
  private mailerServices: MailerServices; 
  private PasswordService: PasswordService;

  constructor( 
    UserAuthRepository: userAuthRepository, 
    mailerServices: MailerServices, 
    PasswordService: PasswordService, 
    OTPRepository: OTPRepository 
  ) { 
    this.UserAuthRepository = UserAuthRepository; 
    this.mailerServices = mailerServices; 
    this.PasswordService = PasswordService; 
    this.OTPRepository = OTPRepository; 
  }

  async handleUserLogin(credentials: ILoginRequest): Promise<{ accessToken: string; refreshToken: string } | void> { 
    try { 
      const { email, password } = credentials; 
      const isEmailExisted = await this.UserAuthRepository.findUserByEmail(email); 
      if ((isEmailExisted && !isEmailExisted.isVerified) || !isEmailExisted) { 
        throw { status: HttpStatus.NOT_FOUND, message: ErrorMessages.USER_NOT_FOUND }; 
      }
      const isPasswordMatch = await this.PasswordService.verifyPassword(password, isEmailExisted.password || ""); 
      if (isPasswordMatch) { 
        const refreshToken = await JWT.refreshToken(isEmailExisted.id); 
        const accessToken = await JWT.generateToken(isEmailExisted.id); 
        return { accessToken, refreshToken }; 
      } else { 
        throw { status: HttpStatus.UNAUTHORIZED, message: ErrorMessages.INVALID_PASSWORD }; 
      } 
    } catch (err) { 
      throw err; 
    } 
  }

  async registerUser(newUserData: IRegistrationRequest): Promise<void | never> { 
    try { 
      const isEmailExisted = await this.UserAuthRepository.findUserByEmail(newUserData.email); 
      if (isEmailExisted && isEmailExisted.isVerified) { 
        throw { status: HttpStatus.BAD_REQUEST, message: ErrorMessages.EMAIL_ALREADY_EXISTS }; 
      }
      const hashPassword: string = await this.PasswordService.hashPassword(newUserData.password); 
      newUserData.password = hashPassword; 
      await this.UserAuthRepository.createNewUser(newUserData); 
      await this.sendVerificationOTP(newUserData.name, newUserData.email); 
    } catch (err: any) { 
      throw err; 
    } 
  }

  async sendVerificationOTP(name: string, email: string): Promise<void | never> { 
    try { 
      const otp = await generateOTP.generate(); 
      const expiresAt = await generateOTP.ExpireDate(); 
      const otpData: IOTPCredentials = { name, email, otp, expiresAt }; 
      await this.OTPRepository.saveOTPForEmail(otpData); 
      await this.mailerServices.sendEmail(otpData); 
    } catch (err) { 
      throw err; 
    } 
  }

  async handleOtpConfirmation(email: string, enteredOtp: string): Promise<IAuthTokens | void> { 
    try { 
      if (!enteredOtp || !email) { 
        throw { status: HttpStatus.NOT_FOUND, message: ErrorMessages.OTP_INCORRECT }; 
      }
      const recordOtp = await this.OTPRepository.findOTPByEmail(email); 
      const userData = await this.UserAuthRepository.findUserByEmail(email);
      if (!recordOtp) { 
        throw { status: HttpStatus.UNAUTHORIZED, message: ErrorMessages.OTP_EXPIRED }; 
      }
      if (enteredOtp === recordOtp.otp) { 
        await this.UserAuthRepository.markUserAsVerified(email); 
        const accessToken = await JWT.generateToken(userData!.id); 
        const refreshToken = await JWT.refreshToken(userData!.id); 
        return { accessToken, refreshToken }; 
      } else { 
        throw { status: HttpStatus.UNAUTHORIZED, message: ErrorMessages.OTP_INCORRECT }; 
      } 
    } catch (err) { 
      throw err; 
    } 
  }

  async resendVerificationOTP(email: string): Promise<void | never> { 
    try { 
      const user = await this.UserAuthRepository.findUserByEmail(email); 
      if (!user) { 
        throw new Error("User not found"); 
      }
      await this.OTPRepository.removeOTPByEmail(email); 
      await this.sendVerificationOTP(user.name, email); 
    } catch (err) { 
      throw err; 
    } 
  }

  async validateAccessToken(accessToken: string, refreshToken: string): Promise<{ accessToken: string; userData: IUser | null }> { 
    try { 
      let userData: IUser | null = null; 
      const decodedToken = await JWT.verifyToken(accessToken); 
      if (typeof decodedToken === "object" && decodedToken !== null && "id" in decodedToken) { 
        userData = await this.UserAuthRepository.findUserById(decodedToken.id); 
        if (userData && !userData.isBlocked) { 
          return { accessToken, userData }; 
        } else { 
          throw { status: HttpStatus.FORBIDDEN, message: ErrorMessages.USER_BLOCKED }; 
        } 
      } else { 
        const refreshResponse = await this.refreshAccessToken(refreshToken); 
        if (refreshResponse.accessToken) { 
          userData = await this.UserAuthRepository.findUserById(refreshResponse.userId); 
          if (userData && !userData.isBlocked) { 
            return { accessToken: refreshResponse.accessToken, userData }; 
          } 
        } 
        throw { status: HttpStatus.UNAUTHORIZED, message: ErrorMessages.INVALID_REFRESH_TOKEN }; 
      } 
    } catch (err: any) { 
      let userData: IUser | null = null; 
      if (err.name === "TokenExpiredError") { 
        const refreshResponse = await this.refreshAccessToken(refreshToken); 
        if (refreshResponse.accessToken) { 
          userData = await this.UserAuthRepository.findUserById(refreshResponse.userId); 
          return { accessToken: refreshResponse.accessToken, userData }; 
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
        const userData = await this.UserAuthRepository.findUserById(userId); 
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

  async sentEmailResetPassword(email: string): Promise<void> { 
    try { 
      const user = await this.UserAuthRepository.findUserByEmail(email); 
      if (!user) { 
        throw { status: HttpStatus.NOT_FOUND, message: ErrorMessages.USER_NOT_FOUND }; 
      } 
      const userToken = await JWT.generateToken(user.id); 
      const expiresAt = new Date(); 
      expiresAt.setHours(expiresAt.getHours() + 1); 
      await this.OTPRepository.saveResetToken(user.email, userToken, expiresAt); 
      await this.mailerServices.sendRestPasswordLink(user.name, user.email, userToken); 
    } catch (err) { 
      throw err; 
    } 
  }
}


  // async handleResetPassword(password: string, token: string): Promise<void> {
  //   try {
  //     const user = await this.validateAccessToken(token,'');
  //     if (user) {
  //       if (user.resetToken == null) {
  //         throw {
  //           status: HttpStatus.UNAUTHORIZED,
  //           message: ErrorMessages.TOKEN_MISSING,
  //         };
  //       }
  //       const hashPassword = await this.PasswordService.hashPassword(password);

  //       await this.OTPRepository.resetPassword(user.id, hashPassword);
  //       await this.OTPRepository.removeResetToken(user.email);
  //     } else {
  //       throw {
  //         status: HttpStatus.NOT_FOUND,
  //         message: ErrorMessages.USER_NOT_FOUND,
  //       };
  //     }
  //   } catch (error) {
  //     throw error;
  //   }
  // }

