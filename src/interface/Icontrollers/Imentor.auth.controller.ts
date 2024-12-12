import { Request,Response,NextFunction } from "express"
export default interface IMentorAuthController {
   MentorApplicationRequest(req:Request,res:Response,next:NextFunction):Promise<void>;
   MentorLoginRequest(req:Request,res:Response,next: NextFunction): Promise<void>;
   authenticateTokenRequest(req: Request, res: Response, next: NextFunction): Promise<void>;
   MentorLogoutRequest(req: Request, res: Response, next: NextFunction): Promise<void>;
}