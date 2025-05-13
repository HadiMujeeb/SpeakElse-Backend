import { Request,Response,NextFunction } from "express"
export interface IMentorAuthController {
   mentorApplicationRequest(req:Request,res:Response,next:NextFunction):Promise<void>;
   mentorLoginRequest(req:Request,res:Response,next: NextFunction): Promise<void>;
   authenticateTokenRequest(req: Request, res: Response, next: NextFunction): Promise<void>;
   mentorLogoutRequest(req: Request, res: Response, next: NextFunction): Promise<void>;
}