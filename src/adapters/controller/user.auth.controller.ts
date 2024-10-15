import { Request, Response, NextFunction } from "express";

// Interface imports 
import { IUserRegisterCredentials } from "../../domain/interface/controllers/user.IAuth.controller";
import { IuserAuthenticationController } from "../../domain/interface/controllers/user.IAuth.controller";
import { IOTPData } from "../../domain/interface/controllers/user.IAuth.controller";
import { IUserLoginCredentials } from "../../domain/interface/controllers/user.IAuth.controller";

// Use case import 
import UserAuthUseCase from "../../usecase/user.Auth.usecase";

// Status code import
import { HttpStatus } from "../../domain/StatusCodes/HttpStatus";
// Success messages import
import { SuccessMessages } from "../../domain/StatusMessages/SuccessMessages";
// Error messages import 
import { ErrorMessages } from "../../domain/StatusMessages/ErrorMessages";
import { IUser } from "../../domain/entities/user";

export default class UserAuthController implements IuserAuthenticationController {

  private userAuthUseCase: UserAuthUseCase;

  constructor(userAuthUseCase: UserAuthUseCase) {
    this.userAuthUseCase = userAuthUseCase;
  }

  // Handles user registration requests and sends an OTP
  async UserRegistrationRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const newUserData: IUserRegisterCredentials = req.body;
      await this.userAuthUseCase.registerUser(newUserData);
      res.status(HttpStatus.CREATED).json({ message: SuccessMessages.OTP_SENT });
    } catch (error: any) {
      next({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error || ErrorMessages.INTERNAL_SERVER_ERROR,
      });
    }
  } 

  // Confirms the OTP provided by the user
  async confirmOtpRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const OtpData: IOTPData = req.body;
      const token = await this.userAuthUseCase.handleOtpConfirmation(OtpData);
      if (token) {
        res.cookie("authToken", token, {
          maxAge: 3600000,
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        });
      } else {
        throw new Error("Cannot find the token");
      }
      res.status(HttpStatus.OK).json({ message: SuccessMessages.USER_VERIFIED });
    } catch (error: any) {
      next({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error || ErrorMessages.INTERNAL_SERVER_ERROR,
      });
    }
  }

  // Handles user login requests and returns an auth token
  async UserLoginRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const credentials: IUserLoginCredentials = req.body;
      const Token = await this.userAuthUseCase.handleUserLogin(credentials);
      if (Token) {
        res.cookie("authToken", Token, {
          maxAge: 3600000,
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        });
        res.status(HttpStatus.OK).json({ message: SuccessMessages.LOGIN_SUCCESS });
      } else {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: ErrorMessages.INVALID_PASSWORD });
      }
    } catch (error: any) {
      next({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error || ErrorMessages.INTERNAL_SERVER_ERROR,
      });
    }
  }

  // Authenticates the user's token and returns user data
  async authenticateTokenRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const token = req.cookies.authToken || req.headers.authorization?.split(" ")[1];
      if (!token) {
        throw new Error(ErrorMessages.TOKEN_MISSING);
      }
      const userData = await this.userAuthUseCase.validateAccessToken(token);
      res.status(HttpStatus.OK).json({
        message: SuccessMessages.ACCESS_GRANTED,
        user: userData,
      });
    } catch (error) {
      next({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error || ErrorMessages.INTERNAL_SERVER_ERROR,
      });
    }
  }

  // Handles user logout requests and clears the auth token
  async UserLogoutRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.clearCookie("authToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
      res.status(HttpStatus.OK).json({ message: SuccessMessages.LOGOUT_SUCCESS });
    } catch (error) {
      next({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error || ErrorMessages.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async resendOTPRequest(req: Request, res: Response, next: NextFunction): Promise<void | never> {
    try {
      const {email} = req.body;
      await this.userAuthUseCase.resendVerificationOTP(email);
      res.status(HttpStatus.OK).json({message:SuccessMessages.OTP_RESEND_SUCCESS})
      
    } catch (error) {
      next({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error || ErrorMessages.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
