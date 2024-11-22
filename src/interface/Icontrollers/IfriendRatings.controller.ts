import { Express, Request, Response, NextFunction } from "express";


export default interface IFriendRatingsController {
     requestFollowUnfollow: (req: Request, res: Response, next: NextFunction) => Promise<void>;
     requestRetrieveRatings: (req: Request, res: Response, next: NextFunction) => Promise<void>;
     requestGiveRating: (req: Request, res: Response, next: NextFunction) => Promise<void>; 
}