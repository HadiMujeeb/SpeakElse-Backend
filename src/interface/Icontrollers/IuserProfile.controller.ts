import { Request,Response,NextFunction } from "express";

export default interface IuserProfileController {
requestEditUserData(req:Request,res:Response,next:NextFunction):Promise<void>;
requestFollowUnfollow: (req: Request, res: Response, next: NextFunction) => Promise<void>;
requestRetrieveRatings: (req: Request, res: Response, next: NextFunction) => Promise<void>;
requestGiveRating: (req: Request, res: Response, next: NextFunction) => Promise<void>; 

}