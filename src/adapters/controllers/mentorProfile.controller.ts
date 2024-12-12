import { NextFunction, Request, Response } from "express";
import mentorProfileUseCase from "../../usecase/mentorProfile.usecase";
import { IUser } from "../../domain/entities/user.entities";
import { HttpStatus } from "../../domain/responseStatus/httpcode";
import { SuccessMessages } from "../../domain/responseMessages/successMessages";
import IMentorProfileController from "../../interface/Icontrollers/ImentorProfile.controller";
import IApplication from "../../domain/entities/mentor.entities";

export default class mentorProfileController
  implements IMentorProfileController
{
  constructor(private MentorProfileUseCase: mentorProfileUseCase) {
    this.MentorProfileUseCase = MentorProfileUseCase;
  }

  async requestEditMentorData(req: Request,res: Response,next: NextFunction): Promise<void> {
    try {
      const updatedData:IApplication = {
        ...req.body,avatar: req.file ? req.file.path : null,
      };
      const mentorData = await this.MentorProfileUseCase.handleEditmentorData(updatedData);
      res.status(HttpStatus.OK).json({ message: SuccessMessages.MENTOR_UPDATED , mentorData });
    } catch (error) {
      next(error);
    }
  }
  async requestGetFeedbackRatings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const mentorId = req.params.id ;
      const feedbackRatings = await this.MentorProfileUseCase.getfeedbackRatings(mentorId);
      res.status(HttpStatus.OK).json({ message: SuccessMessages.RATINGS_RETRIEVED, feedbackRatings });
    } catch (error) {
      next(error);
  }
}
}
