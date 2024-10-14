import { JwtPayload } from "jsonwebtoken";
import { IUser } from "../domain/entities/user";
import OTPRepository from "../infrastructure/repositories/Otp.Repository";
import { userAuthRepository } from "../infrastructure/repositories/user.Auth.repository";
import { MailerServices } from "../domain/thirdParty/emailService";
import { JWT } from "../domain/thirdParty/jwtService";
import { IUserAuthUseCase } from "../domain/interface/usecase/user.IAuth.usecase";
import { IUserLoginCredentials, IUserRegisterCredentials } from "../domain/interface/controllers/user.IAuth.controller";
import { PasswordService } from "../domain/thirdParty/passwordServices";
import { generateOTP } from "../domain/utils/generateOTP.utils";
import IOTPCredentials from "../domain/interface/controllers/IOTP.controller";
import { OTPData } from "../domain/interface/controllers/user.IAuth.controller";
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

 async handleUserLogin(credentials: IUserLoginCredentials): Promise<void|boolean> {
    try {
      const {email,password} = credentials
      const isEmailExisted = await this.UserAuthRepository.findUserByEmail(
        email
      );
      if (isEmailExisted && !isEmailExisted.isVerified||!isEmailExisted) {
        throw new Error("Email is not existed");
      }
      const isPasswordMatch = await this.PasswordService.verifyPassword(
        password,
        isEmailExisted.password
      );
      if (isPasswordMatch) {
        return true
      }else{
        throw new Error("password not matched")
      }
    } catch (err) {
      throw err
    }
  }


  async registerUser(
    newUserData: IUserRegisterCredentials
  ): Promise<void | never> {
    try {
      const isEmailExisted = await this.UserAuthRepository.findUserByEmail(
        newUserData.email
      );
      if (isEmailExisted && isEmailExisted.isVerified) {
        throw new Error("Email is already exists");
      }
      const hashPassword: string = await this.PasswordService.hashPassword(
        newUserData.password
      );
      newUserData.password = hashPassword;

      await this.UserAuthRepository.createNewUser(newUserData);

      await this.sendVerificationOTP(newUserData.name, newUserData.email);
    } catch (err: any) {
      throw err;
    }
  }

  async sendVerificationOTP(
    name: string,
    email: string
  ): Promise<void | never> {
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

  async handleOtpConfirmation(
    sentedData:OTPData
  ): Promise<string | void> {
    try {
      const recordOtp = await this.OTPRepository.findOTPByEmail(sentedData.email);
      const userData = await this.UserAuthRepository.findUserByEmail(sentedData.email);
      if (!recordOtp) {
        throw new Error("recordOtp is Expired");
      }

      const { otp, expiresAt } = recordOtp;
      if (new Date() < expiresAt) {
        if (recordOtp.otp == sentedData.enteredOtp) {
          await this.UserAuthRepository.markUserAsVerified(sentedData.email);
          await this.OTPRepository.removeOTPByEmail(sentedData.email);
          const userToken = await JWT.generateToken(userData!.id);
          return userToken;
        }
      } else {
        await this.OTPRepository.removeOTPByEmail(sentedData.email);
      }
    } catch (err) {
      throw err;
    }
  }


async validateAccessToken(token: string): Promise<void> {
  try {
    const decodedToken = await JWT.verifyToken(token);
    if( typeof decodedToken ==="object" && decodedToken !==null && "id" in decodedToken){
      // const user = await this.userRepository.findById(decodedToken.id);
    }
  } catch (err) {
    throw err
  }
}

  // async verifyToken(token: string) {
  //   try {
  //     const decodedToken = await JWT.verifyToken(token);
  //     console.log("working", decodedToken);

  //     // Check if the decoded token has a valid ID
  //     if (
  //       typeof decodedToken === "object" &&
  //       decodedToken !== null &&
  //       "id" in decodedToken
  //     ) {
  //       const user = await this.userRepository.findById(decodedToken.id);
  //       if (user) {
  //         return {
  //           status: 200,
  //           message: "Token is valid",
  //           user,
  //         };
  //       } else {
  //         return {
  //           status: 404,
  //           message: "User not found",
  //         };
  //       }
  //     } else {
  //       return {
  //         status: 401,
  //         message: "Invalid token",
  //       };
  //     }
  //   } catch (error) {
  //     console.error("Error verifying token:", error);
  //     return {
  //       status: 500,
  //       message: "Server error during token verification",
  //     };
  //   }
  // }
}
