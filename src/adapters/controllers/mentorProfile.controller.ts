import { NextFunction, Request, Response } from "express";
import mentorProfileUseCase from "../../usecase/mentorProfile.usecase";
import { IUser } from "../../domain/entities/user.entities";
import { HttpStatus } from "../../domain/responseStatus/httpcode";
import { SuccessMessages } from "../../domain/responseMessages/successMessages";
import IMentorProfileController from "../../interface/Icontrollers/ImentorProfile.controller";

export default class mentorProfileController
  implements IMentorProfileController
{
  constructor(private MentorProfileUseCase: mentorProfileUseCase) {
    this.MentorProfileUseCase = MentorProfileUseCase;
  }

  async requestEditMentorData(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const updatedData = {
        ...req.body,
        avatar: req.file ? req.file.path : null,
      };
      await this.MentorProfileUseCase.handleEditmentorData(updatedData);

      res.status(HttpStatus.OK).json({ message: SuccessMessages.USER_UPDATED });
    } catch (error) {
      next(error);
    }
  }
}
