import { Request, Response, NextFunction } from "express";
import { IuserAuthenticationController, ILoginRequest, IRegistrationRequest, IOtpVerification, IAuthTokens } from "../../interface/Icontrollers/Iuser.auth.controller";
import UserAuthUseCase from "../../usecase/user.Auth.usecase";
import { HttpStatus } from "../../domain/responseStatus/httpcode";
import { SuccessMessages } from "../../domain/responseMessages/successMessages";
import { ErrorMessages } from "../../domain/responseMessages/errorMessages";

export default class UserAuthController implements IuserAuthenticationController {
  private userAuthUseCase: UserAuthUseCase;
  constructor(userAuthUseCase: UserAuthUseCase) {
    this.userAuthUseCase = userAuthUseCase;
  }

  async UserRegistrationRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const newUserData: IRegistrationRequest = req.body;
      if (newUserData.password !== newUserData.confirmPassword) throw { status: HttpStatus.BAD_REQUEST, message: ErrorMessages.PASSWORD_MISMATCH };
      await this.userAuthUseCase.registerUser(newUserData);
      res.status(HttpStatus.CREATED).json({ message: SuccessMessages.OTP_SENT });
    } catch (error: any) {
      next(error);
    }
  }

  async confirmOtpRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const OtpData: IOtpVerification = req.body;
      const token = await this.userAuthUseCase.handleOtpConfirmation(OtpData.email, OtpData.enteredotp);
      if (token) {
        res.cookie("refreshToken", token.refreshToken, { maxAge: 604800000, httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" });
        res.status(HttpStatus.OK).json({ message: SuccessMessages.USER_VERIFIED, accessToken: token.accessToken });
      } else throw new Error("Cannot find the token");
    } catch (error: any) {
      next(error);
    }
  }

  async UserLoginRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const credentials: ILoginRequest = req.body;
      const Token: void | IAuthTokens = await this.userAuthUseCase.handleUserLogin(credentials);
      if (Token) {
        res.cookie("refreshToken", Token.refreshToken, { maxAge: 604800000, httpOnly: true, secure: process.env.NODE_ENV === "production" });
        res.status(HttpStatus.OK).json({ message: SuccessMessages.LOGIN_SUCCESS, accessToken: Token.accessToken });
      } else {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: ErrorMessages.INVALID_PASSWORD });
      }
    } catch (error: any) {
      next(error);
    }
  }

  async authenticateTokenRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const accessToken = req.header('Authorization')?.replace('Bearer ', '');
      const refreshToken = req.cookies.refreshToken;
      if (!accessToken || !refreshToken) throw { status: HttpStatus.UNAUTHORIZED, message: ErrorMessages.TOKEN_MISSING };
      const userData = await this.userAuthUseCase.validateAccessToken(accessToken, refreshToken);
      res.status(HttpStatus.OK).json({ message: SuccessMessages.ACCESS_GRANTED, user: userData.userData, accessToken: userData.accessToken, status: HttpStatus.OK });
    } catch (error) {
      next(error);
    }
  }

  async UserLogoutRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.clearCookie("refreshToken", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" });
      res.status(HttpStatus.OK).json({ message: SuccessMessages.LOGOUT_SUCCESS });
    } catch (err: any) {
      next({ status: HttpStatus.INTERNAL_SERVER_ERROR, message: err.message || ErrorMessages.INTERNAL_SERVER_ERROR });
    }
  }

  async resendOTPRequest(req: Request, res: Response, next: NextFunction): Promise<void | never> {
    try {
      const { email } = req.body;
      await this.userAuthUseCase.resendVerificationOTP(email);
      res.status(HttpStatus.OK).json({ message: SuccessMessages.OTP_RESEND_SUCCESS });
    } catch (error) {
      next(error);
    }
  }

  async requestSentMailResetPassword(req: Request, res: Response, next: NextFunction): Promise<void | never> {
    try {
      const { email } = req.body;
      await this.userAuthUseCase.sentEmailResetPassword(email);
      res.status(HttpStatus.OK).json({ message: SuccessMessages.PASSWORD_RESET_EMAIL_SENT });
    } catch (error) {
      next(error);
    }
  }

  async requestResetPassword(req: Request, res: Response, next: NextFunction): Promise<void | never> {
    try {
      const { token, password } = req.body;
      if (!token) throw { status: HttpStatus.NOT_FOUND, message: ErrorMessages.TOKEN_MISSING };
      res.status(HttpStatus.OK).json({ message: SuccessMessages.PASSWORD_CHANGED });
    } catch (error) {
      next(error);
    }
  }
}
