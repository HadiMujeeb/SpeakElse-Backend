import { Request,Response,NextFunction } from "express";

export default interface IuserProfileController {
requestEditMemberData(req:Request,res:Response,next:NextFunction):Promise<void|never>;

}