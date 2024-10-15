// interface 

import { IUserAuthUseCase } from "../domain/interface/usecase/user.IAuth.usecase";
import { IUserLoginCredentials, IUserRegisterCredentials } from "../domain/interface/controllers/user.IAuth.controller";
import IOTPCredentials from "../domain/interface/controllers/IOTP.controller";
import { IOTPData } from "../domain/interface/controllers/user.IAuth.controller";
import { IUser } from "../domain/entities/user";

// Repository 
import OTPRepository from "../infrastructure/repositories/Otp.Repository";
import { userAuthRepository } from "../infrastructure/repositories/user.Auth.repository";


// thirdParty utils 
import { MailerServices } from "../domain/thirdParty/emailService";
import { JWT } from "../domain/thirdParty/jwtService";
import { PasswordService } from "../domain/thirdParty/passwordServices";

// logic utils
import { generateOTP } from "../domain/utils/generateOTP.utils";



//  status code 
import { HttpStatus } from "../domain/StatusCodes/HttpStatus";

// error Messages 
import { ErrorMessages } from "../domain/StatusMessages/ErrorMessages";

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
  async handleUserLogin(credentials: IUserLoginCredentials): Promise<string | void> {
    try {
      const { email, password } = credentials;
      const isEmailExisted = await this.UserAuthRepository.findUserByEmail(email);
      if (isEmailExisted && !isEmailExisted.isVerified || !isEmailExisted) {
        throw new Error("Email is not existed");
      }
      const isPasswordMatch = await this.PasswordService.verifyPassword(password, isEmailExisted.password||'');
      if (isPasswordMatch) {
        const userToken = await JWT.generateToken(isEmailExisted.id);
        return userToken;
      } else {
        throw new Error("Password not matched");
      }
    } catch (err) {
      throw err;
    }
  }

  // Registers a new user and sends a verification OTP
  async registerUser(newUserData: IUserRegisterCredentials): Promise<void | never> {
    try {
      const isEmailExisted = await this.UserAuthRepository.findUserByEmail(newUserData.email);
      if (isEmailExisted && isEmailExisted.isVerified) {
        throw new Error("Email already exists");
      }
      const hashPassword: string = await this.PasswordService.hashPassword(newUserData.password);
      newUserData.password = hashPassword;

      await this.UserAuthRepository.createNewUser(newUserData);
      await this.sendVerificationOTP(newUserData.name, newUserData.email);
    } catch (err: any) {
      throw err;
    }
  }

  // Sends a verification OTP to the user's email
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

  // Confirms the OTP entered by the user
  async handleOtpConfirmation(sentedData: IOTPData): Promise<string | void> {
    try {
      const recordOtp = await this.OTPRepository.findOTPByEmail(sentedData.email);
      const userData = await this.UserAuthRepository.findUserByEmail(sentedData.email);
      if (!recordOtp) {
        throw new Error("Record OTP is expired");
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
 

  async resendVerificationOTP(email: string): Promise<void | never> {
    try {
      const user = await this.UserAuthRepository.findUserByEmail(email);
      if (!user) {
        throw new Error("User not found");
      }
      const ExistedRecord = await this.OTPRepository.findOTPByEmail(email);
       if(ExistedRecord){
        await this.OTPRepository.removeOTPByEmail(email);
       }
       await this.sendVerificationOTP(user.name, email);
    } catch (err) {
      throw err
    }
  }


  // Validates the access token and returns user data
  async validateAccessToken(token: string): Promise<IUser | null> {
    try {
      const decodedToken = await JWT.verifyToken(token);
      if (typeof decodedToken === "object" && decodedToken !== null && "id" in decodedToken) {
        const userData = await this.UserAuthRepository.findUserById(decodedToken.id);
        return userData ? userData : null;
      } else {
        throw new Error(ErrorMessages.INVALID_TOKEN);
      }
    } catch (err) {
      throw err;
    }
  }

async requestPasswordResetEmail(email: string): Promise<void> {
  try {
    const user = await this.UserAuthRepository.findUserByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }

    
    


  } catch (err) {
    throw err
  }
}


}
