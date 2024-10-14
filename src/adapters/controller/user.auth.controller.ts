import { Request, Response, NextFunction } from "express";

// interface 
import { IUserRegisterCredentials } from "../../domain/interface/controllers/user.IAuth.controller";
import { IuserAuthenticationController } from "../../domain/interface/controllers/user.IAuth.controller";
import { OTPData } from "../../domain/interface/controllers/user.IAuth.controller";
import { IUserLoginCredentials } from "../../domain/interface/controllers/user.IAuth.controller";

// usecase 
import UserAuthUseCase from "../../usecase/user.Auth.usecase";

// status code
import { HttpStatus } from "../../domain/StatusCodes/HttpStatus";
// SuccessMessages
import { SuccessMessages } from "../../domain/StatusMessages/SuccessMessages";
// ErrorMessages 
import { ErrorMessages } from "../../domain/StatusMessages/ErrorMessages";



export default class UserAuthController implements IuserAuthenticationController {

  private userAuthUseCase: UserAuthUseCase;


  constructor(userAuthUseCase: UserAuthUseCase) {
    this.userAuthUseCase = userAuthUseCase;

  }

  async UserRegistrationRequest(req: Request, res: Response , next:NextFunction): Promise<void> {
    try {

      const newUserData: IUserRegisterCredentials = req.body;

      await this.userAuthUseCase.registerUser(newUserData);

      res.status(HttpStatus.CREATED).json({message:SuccessMessages.OTP_SENT});

    } catch (error: any) {
      next({
        status:HttpStatus.INTERNAL_SERVER_ERROR,
        message:error||ErrorMessages.INTERNAL_SERVER_ERROR,
      })
    }
  } 

  async confirmOtpRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
       const OtpData:OTPData = req.body;
       const token = await this.userAuthUseCase.handleOtpConfirmation(OtpData);
       if(token){
        res.cookie("authToken", token,{
          maxAge: 3600000,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        });
       }else{
        throw new Error("cannot find the token")
       }
       res.status(HttpStatus.OK).json({message:SuccessMessages.USER_VERIFIED})
      
    } catch (error:any) {
      next({
        status:HttpStatus.INTERNAL_SERVER_ERROR,
        message:error||ErrorMessages.INTERNAL_SERVER_ERROR,
      })
    }
  }


  async UserLoginRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
     const credentials:IUserLoginCredentials = req.body;
     const isLogin = await this.userAuthUseCase.handleUserLogin(credentials);
     if(isLogin){
      res.status(HttpStatus.OK).json({message:SuccessMessages.LOGIN_SUCCESS})
     }else{
      res.status(HttpStatus.UNAUTHORIZED).json({message:ErrorMessages.INVALID_PASSWORD})
     }
    } catch (error:any) {
      next({
        status:HttpStatus.INTERNAL_SERVER_ERROR,
        message:error||ErrorMessages.INTERNAL_SERVER_ERROR,
      })
    }
  }


  async UserLogoutRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.clearCookie("authToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
     });

    res.status(HttpStatus.OK).json({message:SuccessMessages.LOGOUT_SUCCESS})
    } catch (error) {
      next({
        status:HttpStatus.INTERNAL_SERVER_ERROR,
        message:error||ErrorMessages.INTERNAL_SERVER_ERROR,
      })
    }
  }


  // async verifyToken(req: Request, res: Response): Promise<void> {
  //   try {
  //     const token =
  //       req.cookies.authToken || req.headers.authorization?.split(" ")[1];

  //     if (!token) {
  //       res.status(401).json({
  //         message: "Authorization token missing",
  //       });
  //       return;
  //     }
  //     console.log("wprnfncwo");

  //     const result = await this.userUsecase.verifyToken(token);

  //     res.status(result.status).json({
  //       message: result.message,
  //       user: result.user,
  //       status: result.status,
  //     });
  //   } catch (error) {
  //     console.error("Token verification error:", error);
  //     res
  //       .status(500)
  //       .json({ message: "Internal server error during token verification" });
  //   }
  // }

  // async logout(req: Request, res: Response): Promise<void> {
  //   try {
  //     console.log("wfnwfoiwoiwooiniownfwifnfifn");
  //     res.clearCookie("authToken", {
  //       httpOnly: true,
  //       secure: process.env.NODE_ENV === "production",
  //       sameSite: "lax",
  //     });
  //     res.status(200).json({
  //       message: "Logout successful",
  //     });
  //   } catch (error) {
  //     console.error("Logout error:", error);
  //     res.status(500).json({ message: "Internal server error during logout" });
  //   }
  // }
}
