import { json, NextFunction, Request, Response } from "express";

import adminUseCase from "../../usecase/admin.usecase";
import { HttpStatus } from "../../domain/responseStatus/httpcode";
import { SuccessMessages } from "../../domain/responseMessages/successMessages";
import { ErrorMessages } from "../../domain/responseMessages/errorMessages";
import { IAuthTokens } from "../../interface/Icontrollers/Iuser.auth.controller";
import { IAdminController } from "../../interface/Icontrollers/Iadmin.controller";

export default class adminController implements IAdminController {
  constructor(private adminUseCase: adminUseCase) {
    this.adminUseCase = adminUseCase;
  }

  async adminLogin(req: Request,res: Response,next: NextFunction): Promise<void | never> {
    try {
      const { email, password } = req.body;
      const Token:IAuthTokens|void = await this.adminUseCase.handleAdminlogin(email,password);
      if (Token) {
        res.cookie("refreshToken", Token.refreshToken, { maxAge: 604800000, httpOnly: true, secure: process.env.NODE_ENV === "production" });
        res.status(HttpStatus.OK).json({ message: SuccessMessages.LOGIN_SUCCESS, accessToken: Token.accessToken });
      } else {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: ErrorMessages.INVALID_PASSWORD });
      }
    } catch (error) {
      next(error);
    }
  }

  async adminAuthTokenRequest(req: Request, res: Response, next: NextFunction): Promise<void>{
    try {
      const accessToken = req.header('Authorization')?.replace('Bearer ', '');
      const refreshToken = req.cookies.refreshToken;
      if (!accessToken || !refreshToken) throw { status: HttpStatus.UNAUTHORIZED, message: ErrorMessages.TOKEN_MISSING };
      const adminData = await this.adminUseCase.validateAdminAccessToken(accessToken, refreshToken);
      res.status(HttpStatus.OK).json({ message: SuccessMessages.ACCESS_GRANTED, adminData: adminData, accessToken: adminData.accessToken, status: HttpStatus.OK });
    } catch (error) {
      next(error)
    }
  }

  async adminLogoutRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.clearCookie("refreshToken", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" });
      res.status(HttpStatus.OK).json({ message: SuccessMessages.LOGOUT_SUCCESS });
    } catch (err: any) {
      next({ status: HttpStatus.INTERNAL_SERVER_ERROR, message: err.message || ErrorMessages.INTERNAL_SERVER_ERROR });
    }
  }
}


