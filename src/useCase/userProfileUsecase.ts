import { IUser } from "../domain/entities/user";
import IUserProfileUseCase from "../domain/interface/usecase/IuserProfile.usecase";
import ProfileRepository from "../infrastructure/repositories/userProfileRepository";
import cloudinaryServices from "../domain/thirdParty/cloudinaryServices";

export default class userProfileUseCase implements IUserProfileUseCase{
  private profileRepository: ProfileRepository;

  constructor(profileRepository: ProfileRepository) {
    this.profileRepository = profileRepository;
  }
  async handleEditmemberData(memberId: string, credential: IUser, fileBuffer: Buffer | null): Promise<void | never> {
        try {
            if (credential.avatar && fileBuffer) { // Check if avatar is present and fileBuffer is not null
                credential.avatar = await cloudinaryServices.uploadImage(fileBuffer); // Upload image to Cloudinary
            }
            await this.profileRepository.updateUserData(memberId, credential); // Update user data
        } catch (error) {
            throw error; // Rethrow error for handling
        }
    }

  
}
