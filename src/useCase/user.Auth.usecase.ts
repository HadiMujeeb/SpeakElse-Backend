// interface

import { IUserAuthUseCase } from "../interface/Iusecase/Iuser.auth.usecase";
import {
  IUserLoginCredentials,
  IUserRegisterCredentials,
} from "../interface/Icontrollers/Iuser.auth.controller";
import IOTPCredentials from "../interface/Icontrollers/IOTP.controller";
import { IOTPData } from "../interface/Icontrollers/Iuser.auth.controller";
import { IUser } from "../domain/entities/user.entities";

// Repository
import OTPRepository from "../infrastructure/repositories/otp.repository";
import { userAuthRepository } from "../infrastructure/repositories/user.Auth.repository";

// thirdParty utils
import { MailerServices } from "../domain/services/email.service";
import { JWT } from "../domain/services/jwt.service";
import { PasswordService } from "../domain/services/password.services";

// logic utils
import { generateOTP } from "../domain/utils/generateOTP.util";

//  status code
import { HttpStatus } from "../domain/responseStatus/httpcode";

// error Messages
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

  // Handles user login and returns a token if successful
  async handleUserLogin(
    credentials: IUserLoginCredentials
  ): Promise<string | void> {
    try {
      const { email, password } = credentials;

      const isEmailExisted = await this.UserAuthRepository.findUserByEmail(
        email
      );
      if ((isEmailExisted && !isEmailExisted.isVerified) || !isEmailExisted) {
        throw {
          status: HttpStatus.NOT_FOUND,
          message: ErrorMessages.USER_NOT_FOUND,
        };
      }
      const isPasswordMatch = await this.PasswordService.verifyPassword(
        password,
        isEmailExisted.password || ""
      );
      if (isPasswordMatch) {
        const userToken = await JWT.generateToken(isEmailExisted.id);
        return userToken;
      } else {
        throw {
          status: HttpStatus.UNAUTHORIZED,
          message: ErrorMessages.INVALID_PASSWORD,
        };
      }
    } catch (err) {
      throw err;
    }
  }

  // Registers a new user and sends a verification OTP
  async registerUser(
    newUserData: IUserRegisterCredentials
  ): Promise<void | never> {
    try {
      const isEmailExisted = await this.UserAuthRepository.findUserByEmail(
        newUserData.email
      );
      if (isEmailExisted && isEmailExisted.isVerified) {
        console.log("email already exists", isEmailExisted);
        throw {
          status: HttpStatus.BAD_REQUEST,
          message: ErrorMessages.EMAIL_ALREADY_EXISTS,
        };
      }
      const hashPassword: string = await this.PasswordService.hashPassword(
        newUserData.password
      );
      newUserData.password = hashPassword;

      await this.UserAuthRepository.createNewUser(newUserData);
      console.log("succeshjhhhjhs");
      await this.sendVerificationOTP(newUserData.name, newUserData.email);
    } catch (err: any) {
      throw err;
    }
  }

  // Sends a verification OTP to the user's email
  async sendVerificationOTP(
    name: string,
    email: string
  ): Promise<void | never> {
    try {
      const otp = await generateOTP.generate();
      const expiresAt = await generateOTP.ExpireDate();
      const otpData: IOTPCredentials = { name, email, otp, expiresAt };
      console.log("otpData", otpData);
      await this.OTPRepository.saveOTPForEmail(otpData);
      await this.mailerServices.sendEmail(otpData);
    } catch (err) {
      throw err;
    }
  }

  // Confirms the OTP entered by the user
  async handleOtpConfirmation(
    email: string,
    enteredOtp: string
  ): Promise<string | void> {
    try {
      if (!enteredOtp || !email) {
        throw {status:HttpStatus.NOT_FOUND,message:ErrorMessages.OTP_INCORRECT};
      }
      const recordOtp = await this.OTPRepository.findOTPByEmail(email);
      const userData = await this.UserAuthRepository.findUserByEmail(email);

      if (!recordOtp) {
        throw {
          status: HttpStatus.UNAUTHORIZED,
          message: ErrorMessages.OTP_EXPIRED,
        };
      }

      if (enteredOtp === recordOtp.otp) {
        await this.UserAuthRepository.markUserAsVerified(email);
        const userToken = await JWT.generateToken(userData!.id);
        return userToken;
      } else {
        throw {
          status: HttpStatus.UNAUTHORIZED,
          message: ErrorMessages.OTP_INCORRECT,
        };
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
      await this.sendVerificationOTP(user.name, email);
    } catch (err) {
      throw err;
    }
  }

  // Validates the access token and returns user data
  async validateAccessToken(token: string): Promise<IUser | null> {
    try {
      const decodedToken = await JWT.verifyToken(token);
      if (
        typeof decodedToken === "object" &&
        decodedToken !== null &&
        "id" in decodedToken
      ) {
        const userData = await this.UserAuthRepository.findUserById(
          decodedToken.id
        );
        if (userData && !userData.isBlocked) {
          return userData ? userData : null;
        } else {
          throw {
            status: HttpStatus.FORBIDDEN,
            message: ErrorMessages.USER_BLOCKED,
          };
        }
      } else {
        throw new Error(ErrorMessages.INVALID_TOKEN);
      }
    } catch (err) {
      throw err;
    }
  }

  async sentEmailResetPassword(email: string): Promise<void> {
    try {
      const user = await this.UserAuthRepository.findUserByEmail(email);
      if (!user) {
        throw {
          status: HttpStatus.NOT_FOUND,
          message: ErrorMessages.USER_NOT_FOUND,
        };
      }
      const userToken = await JWT.generateToken(user.id);
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 1);

      await this.OTPRepository.saveResetToken(user.email, userToken, expiresAt);
      await this.mailerServices.sendRestPasswordLink(
        user.name,
        user.email,
        userToken
      );
    } catch (err) {
      throw err;
    }
  }

  async handleResetPassword(password: string, token: string): Promise<void> {
    try {
      const user = await this.validateAccessToken(token);
      if (user) {
        if (user.resetToken == null) {
          throw {
            status: HttpStatus.UNAUTHORIZED,
            message: ErrorMessages.TOKEN_MISSING,
          };
        }
        const hashPassword = await this.PasswordService.hashPassword(password);

        await this.OTPRepository.resetPassword(user.id, hashPassword);
        await this.OTPRepository.removeResetToken(user.email);
      } else {
        throw {
          status: HttpStatus.NOT_FOUND,
          message: ErrorMessages.USER_NOT_FOUND,
        };
      }
    } catch (error) {
      throw error;
    }
  }
}
