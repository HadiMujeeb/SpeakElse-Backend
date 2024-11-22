import { IUser } from "../domain/entities/user.entities";
import IUserProfileUseCase from "../interface/Iusecase/IuserProfile.usecase";
import ProfileRepository from "../infrastructure/repository/userProfile.repository";
import cloudinaryServices from "../domain/services/cloudinary.services";
import { HttpStatus } from "../domain/responseStatus/httpcode";
import { ErrorMessages } from "../domain/responseMessages/errorMessages";

export default class userProfileUseCase implements IUserProfileUseCase {
  private profileRepository: ProfileRepository;

  constructor(profileRepository: ProfileRepository) {
    this.profileRepository = profileRepository;
  }

  async handleEditmemberData(MemberData: IUser): Promise<void | never> {
    try {
      if (MemberData.id) {
        const isMemberExist = await this.profileRepository.doesUserExist(
          MemberData.id
        );
        if (!isMemberExist) {
          throw {
            status: HttpStatus.NOT_FOUND,
            message: ErrorMessages.USER_NOT_FOUND,
          };
        }
      }
      await this.profileRepository.updateUserData(MemberData);
    } catch (error) {
      throw error;
    }
  }
}
