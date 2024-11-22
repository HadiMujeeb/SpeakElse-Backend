import { use } from "passport";
import IApplication from "../domain/entities/mentor.entities";
import IMentorAuthUseCase from "../interface/Iusecase/Imentor.auth.usecase";
import { HttpStatus } from "../domain/responseStatus/httpcode";
import { ErrorMessages } from "../domain/responseMessages/errorMessages";
import mentorAuthRepository from "../infrastructure/repository/mentor.Auth.repository";

export default class MentorAuthUseCase implements IMentorAuthUseCase {
  private MentorAuthRepository: mentorAuthRepository;
  constructor(MentorAuthRepository: mentorAuthRepository) {
    this.MentorAuthRepository = MentorAuthRepository;
  }

  async registerMentorApplication(credentials: IApplication): Promise<void> {
    try {
      const Comments = await this.MentorAuthRepository.findUserById(
        credentials.id
      );
      if (!Comments) {
        throw {
          status: HttpStatus.NO_CONTENT,
          message: ErrorMessages.USER_NOT_FOUND,
        };
      }
      if (!credentials) {
        throw {
          status: HttpStatus.NO_CONTENT,
          message: "applicaion data is not here",
        };
      }
      if (Comments.length > 0) {
        const totalRatings = Comments.reduce(
          (acc, comment) => acc + comment.rating,
          0
        );
        credentials.ratings = Math.round(totalRatings / Comments.length);
        credentials.feedbacks = Comments.map((comment) => comment.feedback);
      } else {
        credentials.ratings = 0;
        credentials.feedbacks = [];
      }

      await this.MentorAuthRepository.createMentorshipApplication(credentials);
    } catch (error) {
      throw error;
    }
  }
}
