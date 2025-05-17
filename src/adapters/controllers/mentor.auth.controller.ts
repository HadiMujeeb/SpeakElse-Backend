import { Request, Response, NextFunction } from "express";
import {IMentorAuthController} from "../../interface/Icontrollers/Imentor.auth.controller";
import mentorAuthUseCase from "../../usecase/mentor.auth.usecase";
import IApplication from "../../domain/entities/mentor.entities";
import { HttpStatus } from "../../domain/responseStatus/httpcode";
import { SuccessMessages } from "../../domain/responseMessages/successMessages";
import { IAuthTokens, ILoginRequest } from "../../interface/Icontrollers/Iuser.auth.controller";
import { ErrorMessages } from "../../domain/responseMessages/errorMessages";

export default class mentorAuthController implements IMentorAuthController {
  private mentorAuthUsecase: mentorAuthUseCase;
  constructor(mentorAuthUsecase: mentorAuthUseCase) {
    this.mentorAuthUsecase = mentorAuthUsecase;
  }

  async mentorApplicationRequest(req: Request,res: Response,next: NextFunction): Promise<void> {
    try {
      const files = req.files as { resume: Express.Multer.File[]; avatar: Express.Multer.File[] };
      const credentials: IApplication = {
        ...req.body,
        resume: files.resume?.[0]?.path, 
        avatar: files.avatar?.[0]?.path 
      };
      console.log("data ",credentials.resume,"file",credentials.avatar);
      await this.mentorAuthUsecase.registerMentorApplication(credentials);
      res.status(HttpStatus.CREATED).json({ message: SuccessMessages.APPLICATION_CREATED });
    } catch (error) {
      next(error);
    }
  }

  async mentorLoginRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const credentials: ILoginRequest = req.body;
      const Token: void | IAuthTokens = await this.mentorAuthUsecase.handleMentorLogin(credentials);
      if (Token) {
        res.cookie("mentorRefreshToken", Token.refreshToken, { maxAge: 604800000, httpOnly: true, secure: process.env.NODE_ENV === "production" });
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
      const mentorAccessToken = req.header('Authorization')?.replace('Bearer ', '');
      const mentorRefreshToken = req.cookies.mentorRefreshToken;
      if (!mentorAccessToken || !mentorRefreshToken) throw { status: HttpStatus.UNAUTHORIZED, message: ErrorMessages.TOKEN_MISSING };
      const MentorData = await this.mentorAuthUsecase.validateAccessToken(mentorAccessToken, mentorRefreshToken);
      res.status(HttpStatus.OK).json({ message: SuccessMessages.ACCESS_GRANTED, mentorData: MentorData.mentorData, accessToken: MentorData.accessToken, status: HttpStatus.OK });
    } catch (error) {
      next(error);
    }
  }

  async mentorLogoutRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.clearCookie("mentorRefreshToken", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" });
      res.status(HttpStatus.OK).json({ message: SuccessMessages.LOGOUT_SUCCESS });
    } catch (err: any) {
      next({ status: HttpStatus.INTERNAL_SERVER_ERROR, message: err.message || ErrorMessages.INTERNAL_SERVER_ERROR });
    }
  }


}
