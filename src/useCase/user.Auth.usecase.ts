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
        throw { status:HttpStatus.NOT_FOUND,message:ErrorMessages.USER_NOT_FOUND}
      }
      const isPasswordMatch = await this.PasswordService.verifyPassword(password, isEmailExisted.password||'');
      if (isPasswordMatch) {
        const userToken = await JWT.generateToken(isEmailExisted.id);
        return userToken;
      } else {
        throw { status:HttpStatus.UNAUTHORIZED,message:ErrorMessages.INVALID_PASSWORD}
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
        throw {status:HttpStatus.BAD_REQUEST,message:ErrorMessages.EMAIL_ALREADY_EXISTS}
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
  async handleOtpConfirmation(email:string,enteredOtp:string): Promise<string | void> {
    try {
   
            console.log(email)
      if (!enteredOtp || !email) {
        throw new Error("Entered OTP or email is missing");
      }
  
      const recordOtp = await this.OTPRepository.findOTPByEmail(email);
      const userData = await this.UserAuthRepository.findUserByEmail(email);
  
      if (!recordOtp) {
        throw {status:HttpStatus.UNAUTHORIZED,message:ErrorMessages.OTP_EXPIRED}
      }
  
  
      if (enteredOtp === recordOtp.otp) {  
        console.log("working-4");
        await this.UserAuthRepository.markUserAsVerified(email);
        await this.OTPRepository.removeOTPByEmail(email);
        
        const userToken = await JWT.generateToken(userData!.id);
        return userToken;
      } else {
        await this.OTPRepository.removeOTPByEmail(email);
        throw new Error("Invalid OTP");
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
        if(userData&&!userData.isBlocked){
          return userData ? userData : null;
        }else{
          throw {status:HttpStatus.FORBIDDEN,message:ErrorMessages.USER_BLOCKED}
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
      throw {status:HttpStatus.NOT_FOUND,message:ErrorMessages.USER_NOT_FOUND}
    }
    const userToken = await JWT.generateToken(user.id);
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    await this.OTPRepository.saveResetToken(user.email, userToken, expiresAt);
    await this.mailerServices.sendRestPasswordLink(user.name,user.email,userToken);

  } catch (err) {
    throw err
  }
}

async handleResetPassword(password:string,token:string):Promise<void>{
  try {
    const user = await this.validateAccessToken(token);
    if(user){
      const hashPassword = await this.PasswordService.hashPassword(password);

      await this.OTPRepository.resetPassword(user.id,hashPassword); 
    }else{
      throw {status:HttpStatus.NOT_FOUND,message:ErrorMessages.USER_NOT_FOUND}
    }
  } catch (error) {
    throw error
  }
}


}
