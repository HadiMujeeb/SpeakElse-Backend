import { IUser } from "../domain/entities/user.entities";
import IMentorProfileUseCase from "../interface/Iusecase/ImentorProfile.usecase";
import { HttpStatus } from "../domain/responseStatus/httpcode";
import { ErrorMessages } from "../domain/responseMessages/errorMessages";
import mentorProfileRepository from "../infrastructure/repository/mentor.profileRepository";

export default class mentorProfileUseCase implements IMentorProfileUseCase {
  private MentorProfileRepository: mentorProfileRepository;

  constructor(MentorProfileRepository: mentorProfileRepository) {
    this.MentorProfileRepository = MentorProfileRepository;
  }

  async handleEditmentorData(mentorData: IUser): Promise<void | never> {
    try {
      if (mentorData.id) {
        const isMemberExist = await this.MentorProfileRepository.doesUserExist(
          mentorData.id
        );
        if (!isMemberExist) {
          throw {
            status: HttpStatus.NOT_FOUND,
            message: ErrorMessages.USER_NOT_FOUND,
          };
        }
      }
      await this.MentorProfileRepository.updateMentorData(mentorData);
    } catch (error) {}
  }
}
