import { IComment, IUser } from "../domain/entities/user.entities";
import {IMentorProfileUseCase} from "../interface/Iusecase/ImentorProfile.usecase";
import { HttpStatus } from "../domain/responseStatus/httpcode";
import { ErrorMessages } from "../domain/responseMessages/errorMessages";
import mentorProfileRepository from "../infrastructure/repository/mentor.profileRepository";
import IApplication from "../domain/entities/mentor.entities";

export default class mentorProfileUseCase implements IMentorProfileUseCase {
  private MentorProfileRepository: mentorProfileRepository;

  constructor(MentorProfileRepository: mentorProfileRepository) {
    this.MentorProfileRepository = MentorProfileRepository;
  }

  async handleEditmentorData(data: IApplication): Promise<IApplication> {
   try {
  const mentorData = await this.MentorProfileRepository.updateMentorData(data);
   return mentorData;
   } catch (error) {
   throw error;
   }
 }

 async getfeedbackRatings(mentorId: string): Promise<IComment[]> {
  try {
    return await this.MentorProfileRepository.getfeedbackRatings(mentorId);
  } catch (error) {
    throw error;
  }
 }
}