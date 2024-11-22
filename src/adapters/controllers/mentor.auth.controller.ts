import { Request, Response, NextFunction } from "express";
import IMentorAuthController from "../../interface/Icontrollers/Imentor.auth.controller";
import MentorAuthUseCase from "../../usecase/mentor.auth.usecase";
import IApplication from "../../domain/entities/mentor.entities";
import { HttpStatus } from "../../domain/responseStatus/httpcode";
import { SuccessMessages } from "../../domain/responseMessages/successMessages";

export default class MentorAuthController implements IMentorAuthController {
  private mentorAuthUsecase: MentorAuthUseCase;
  constructor(mentorAuthUsecase: MentorAuthUseCase) {
    this.mentorAuthUsecase = mentorAuthUsecase;
  }

  async MentorApplicationRequest(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const credentials: IApplication = {
        ...req.body,
        resume: req.file?.path,
      };
      console.log(req.file?.path, "working", credentials.id);
      await this.mentorAuthUsecase.registerMentorApplication(credentials);
      res
        .status(HttpStatus.CREATED)
        .json({ message: SuccessMessages.APPLICATION_CREATED });
    } catch (error) {
      next(error);
    }
  }
}
