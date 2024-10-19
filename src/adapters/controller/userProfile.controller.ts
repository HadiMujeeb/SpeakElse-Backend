import { NextFunction, Request, Response } from "express";
import ProfileUsecase from "../../usecase/userProfileUsecase";
import IuserProfileController from "../../domain/interface/controllers/IuserProfile.controller";
import { IUser } from "../../domain/entities/user";
import { HttpStatus } from "../../domain/StatusCodes/HttpStatus";
import { SuccessMessages } from "../../domain/StatusMessages/SuccessMessages";

export default class userProfileController implements IuserProfileController {
    constructor(private profileUsecase: ProfileUsecase) {}

    async requestEditMemberData(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
          const { credential, memberId } = req.body; // Destructure the necessary fields from req.body
          const fileBuffer = req.file ? req.file.buffer : null; // Get the file buffer from req.file

          // Call the use case to handle the update
          await this.profileUsecase.handleEditmemberData(memberId, credential, fileBuffer);

          res.status(HttpStatus.OK).json({ message: SuccessMessages.USER_UPDATED });
      } catch (error) {
          console.error(error); // Log the error for debugging
          res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'An error occurred while updating user data.' });
      }
  }
}
