import { NextFunction, Request, Response } from "express";
import ProfileUsecase from "../../usecase/userProfile.usecase";
import IuserProfileController from "../../interface/Icontrollers/IuserProfile.controller";
import { IUser } from "../../domain/entities/user.entities";
import { HttpStatus } from "../../domain/responseStatus/httpcode";
import { SuccessMessages } from "../../domain/responseMessages/successMessages";

export default class userProfileController implements IuserProfileController {
  constructor(private profileUsecase: ProfileUsecase) {}

  async requestEditMemberData(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const updatedData = {
        ...req.body,
        avatar: req.file ? req.file.path : null,
      };
      await this.profileUsecase.handleEditmemberData(updatedData);

      res.status(HttpStatus.OK).json({ message: SuccessMessages.USER_UPDATED });
    } catch (error) {
      next(error);
    }
  }
}
