import { Request, Response, NextFunction } from "express";

// Interface imports
import { IUserRegisterCredentials, TokenResponse } from "../../interface/Icontrollers/Iuser.auth.controller";
import { IuserAuthenticationController } from "../../interface/Icontrollers/Iuser.auth.controller";
import { IOTPData } from "../../interface/Icontrollers/Iuser.auth.controller";
import { IUserLoginCredentials } from "../../interface/Icontrollers/Iuser.auth.controller";

// Use case import
import UserAuthUseCase from "../../usecase/user.auth.usecase";

// Status code import
import { HttpStatus } from "../../domain/responseStatus/httpcode";
// Success messages import
import { SuccessMessages } from "../../domain/responseMessages/successMessages";
// Error messages import
import { ErrorMessages } from "../../domain/responseMessages/errorMessages";
import { IUser } from "../../domain/entities/user.entities";
import { token } from "morgan";

export default class UserAuthController
  implements IuserAuthenticationController
{
  private userAuthUseCase: UserAuthUseCase;

  constructor(userAuthUseCase: UserAuthUseCase) {
    this.userAuthUseCase = userAuthUseCase;
  }

  // Handles user registration requests and sends an OTP
  async UserRegistrationRequest(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const newUserData: IUserRegisterCredentials = req.body;
      if(newUserData.password !== newUserData.confirmPassword){
        throw {
          status: HttpStatus.BAD_REQUEST,
          message: ErrorMessages.PASSWORD_MISMATCH
      }
        
      }
      await this.userAuthUseCase.registerUser(newUserData);
      res
        .status(HttpStatus.CREATED)
        .json({ message: SuccessMessages.OTP_SENT });
    } catch (error: any) {
      next(error);
    }
  }

  // Confirms the OTP provided by the user
  async confirmOtpRequest(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const OtpData: IOTPData = req.body;
      const email = OtpData.email;
      const enteredOtp = OtpData.enteredotp;
      console.log(OtpData, "data");
      const token = await this.userAuthUseCase.handleOtpConfirmation(
        email,
        enteredOtp
      );
      console.log("token", token);
      if (token) {
        res.cookie("refreshToken", token.refreshToken, {
          maxAge: 604800000,
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        });
      } else {
        throw new Error("Cannot find the token");
      }
      res
        .status(HttpStatus.OK)
        .json({ message: SuccessMessages.USER_VERIFIED,accessToken:token.accessToken });
    } catch (error: any) {
      next(error);
    }
  }

  // Handles user login requests and returns an auth token
  async UserLoginRequest(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const credentials: IUserLoginCredentials = req.body;
      const Token:void|TokenResponse = await this.userAuthUseCase.handleUserLogin(credentials);
      if (Token) {
        res.cookie("refreshToken", Token.refreshToken, {
          maxAge: 604800000, // 7 days
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          // sameSite: "lax",
        });

        res.status(HttpStatus.OK).json({
          message: SuccessMessages.LOGIN_SUCCESS,
          accessToken: Token.accessToken,
        });
      } else {
        res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: ErrorMessages.INVALID_PASSWORD });
      }
    } catch (error: any) {
      next(error);
    }
  }

  // Authenticates the user's token and returns user data
  async authenticateTokenRequest(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const accessToken = req.header('Authorization')?.replace('Bearer ', '');
      const refreshToken = req.cookies.refreshToken;
      console.log("working the funcitn")
        if(!accessToken || !refreshToken){
          console.log("token not found");
          throw {
            status: HttpStatus.UNAUTHORIZED,
            message: ErrorMessages.TOKEN_MISSING,
          };
        }

      const userData = await this.userAuthUseCase.validateAccessToken(accessToken,refreshToken);

       

      res.status(HttpStatus.OK).json({
        message: SuccessMessages.ACCESS_GRANTED,
        user: userData.userData,
        accessToken:userData.accessToken,
        status: HttpStatus.OK,
      });
    } catch (error) {
      next(error);
    }
  }

  // Handles user logout requests and clears the auth token
  async UserLogoutRequest(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });

      res
        .status(HttpStatus.OK)
        .json({ message: SuccessMessages.LOGOUT_SUCCESS });
    } catch (err: any) {
      next({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: err.message || ErrorMessages.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async resendOTPRequest(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | never> {
    try {
      const { email } = req.body;
      await this.userAuthUseCase.resendVerificationOTP(email);
      res
        .status(HttpStatus.OK)
        .json({ message: SuccessMessages.OTP_RESEND_SUCCESS });
    } catch (error) {
      next(error);
    }
  }

  async requestSentMailResetPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | never> {
    try {
      const { email } = req.body;
      console.log("email", email);
      await this.userAuthUseCase.sentEmailResetPassword(email);
      res
        .status(HttpStatus.OK)
        .json({ message: SuccessMessages.PASSWORD_RESET_EMAIL_SENT });
    } catch (error) {
      next(error);
    }
  }

  async requestResetPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | never> {
    try {
      const { token, password } = req.body;
      console.log(password);
      if (!token) {
        throw {
          status: HttpStatus.NOT_FOUND,
          message: ErrorMessages.TOKEN_MISSING,
        };
      }
      // await this.userAuthUseCase.handleResetPassword(password, token);
      res
        .status(HttpStatus.OK)
        .json({ message: SuccessMessages.PASSWORD_CHANGED });
    } catch (error) {
      next(error);
    }
  }
}
