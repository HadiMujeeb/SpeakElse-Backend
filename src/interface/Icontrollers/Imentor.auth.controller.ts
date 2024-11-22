import { Request,Response,NextFunction } from "express"
export default interface IMentorAuthController {
   MentorApplicationRequest(req:Request,res:Response,next:NextFunction):Promise<void>;
}