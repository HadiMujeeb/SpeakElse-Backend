import { Request, Response, NextFunction } from "express";
import IFriendRatingsController from "../../interface/Icontrollers/IfriendRatings.controller";
import FriendRatingsUseCase from "../../usecase/friendRatings.usecase";
import { HttpStatus } from "../../domain/responseStatus/httpcode";
import { IComment } from "../../domain/entities/user.entities";



export default class FriendRatingsController implements IFriendRatingsController {
  private friendRatingsUsecase: FriendRatingsUseCase
  constructor(friendRatingsUsecase: FriendRatingsUseCase) {
    this.friendRatingsUsecase = friendRatingsUsecase
  }


  async requestFollowUnfollow(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId, friendId } = req.body;
      await this.friendRatingsUsecase.followUnfollow(userId, friendId);
      res.status(HttpStatus.OK).json({ message: "Following relationship updated." });

  
}catch (error) {
      next(error);
    }
  }


//   async requestFollowerUnfollower(req: Request, res: Response, next: NextFunction): Promise<void> {
//     try {
//       const { userId, friendId } = req.body;
//       await this.friendRatingsUsecase.followerUnfollower(userId, friendId);
//       res.status(HttpStatus.OK).json({ message: "Follower relationship updated." });
//     } catch (error) {
//       next(error);
//     }
//   }

async requestRetrieveFollowingsFollowers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const  {userId}  = req.body;
      const { following, followers } = await this.friendRatingsUsecase.retriveFollowerFollowing(userId);
      res.status(HttpStatus.OK).json({ following, followers });
    } catch (error) {
      next(error);
    }
  }

  async requestGiveRating(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const  comment: IComment  = req.body;
      console.log("rewrfeeww",comment);
      await this.friendRatingsUsecase.giveRating(comment);
      res.status(HttpStatus.OK).json({ message: "Rating given successfully." });
    } catch (error) {
      next(error);
    }
  }

  async requestRetrieveRatings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.body;
      const ratings: IComment[] = await this.friendRatingsUsecase.retrieveRatings(userId);
      res.status(HttpStatus.OK).json(ratings);
    } catch (error) {
      next(error);
    }
  }
}