import { NextFunction, Request, Response } from "express";
import ProfileUsecase from "../../usecase/userProfile.usecase";
import IuserProfileController from "../../interface/Icontrollers/IuserProfile.controller";
import { IComment, IUser, IuserRating } from "../../domain/entities/user.entities";
import { HttpStatus } from "../../domain/responseStatus/httpcode";
import { SuccessMessages } from "../../domain/responseMessages/successMessages";
import { IQuestions } from "../../domain/entities/tests.entites";

export default class userProfileController implements IuserProfileController {
  constructor(private profileUsecase: ProfileUsecase) {}

  async requestEditUserData(req: Request,res: Response,next: NextFunction): Promise<void> {
    try {
      const updatedData = {
        ...req.body,avatar: req.file ? req.file.path : null,
      };
      await this.profileUsecase.handleEditUserData(updatedData);

      res.status(HttpStatus.OK).json({ message: SuccessMessages.USER_UPDATED });
    } catch (error) {
      next(error);
    }
  }
  
  async requestFollowUnfollow(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId, friendId } = req.body;
      await this.profileUsecase.followUnfollow(userId, friendId);
      res.status(HttpStatus.OK).json({ message: "Following relationship updated." });
    }catch (error) {
      next(error);
    }
  }



async requestRetrieveFollowingsFollowers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const  userId  = req.query.userId as string;
      const { following, followers } = await this.profileUsecase.retriveFollowerFollowing(userId);
      res.status(HttpStatus.OK).json({ following, followers });
    } catch (error) {
      next(error);
    }
  }

  async requestGiveRating(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const  comment: IComment  = req.body;
      await this.profileUsecase.giveRating(comment);
      res.status(HttpStatus.OK).json({ message: "Rating given successfully." });
    } catch (error) {
      next(error);
    }
  }

  async requestRetrieveRatings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.body;
      const ratings: IuserRating[] = await this.profileUsecase.retrieveRatings(userId);
      res.status(HttpStatus.OK).json(ratings);
    } catch (error) {
      next(error);
    }
  }

  async requestgetAllQuestions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const questions: IQuestions[] | [] = await this.profileUsecase.getAllQuestions();
      res.status(HttpStatus.OK).json({ message: SuccessMessages.QUESTIONS_RETRIEVED, data: questions });
    } catch (error) {
      next(error);
    }
  }

}
