import { IComment, IUser, IuserRating } from "../domain/entities/user.entities";
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

  async handleEditUserData(MemberData: IUser): Promise<void> {
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

  async followUnfollow(userId: string, friendId: string): Promise<void> {
    try {
      await this.profileRepository.followUnfollow(userId, friendId);
      await this.profileRepository.followerUnfollower(friendId, userId);
    } catch (error) {
      throw error;
    }
  }

  // async followerUnfollower(userId: string, friendId: string): Promise<void> {
  //     try {
  //         await this.profileRepository.followerUnfollower(userId,friendId);
  //     } catch (error) {
  //         throw error
  //     }
  // }

  async retriveFollowerFollowing(
    userId: string
  ): Promise<{ following: IUser[]; followers: IUser[] }> {
    try {
      const followingId: string[] =
        await this.profileRepository.findAllfollowings(userId);
      const followersId: string[] =
        await this.profileRepository.findAllfollowers(userId);
        const followingUser = await this.profileRepository.findAllFriends(followingId);
        const followersUser = await this.profileRepository.findAllFriends(followersId);
      return {
        following: followingUser,
        followers: followersUser,
      };
    } catch (error) {
      throw error;
    }
  }

  async giveRating(comment: IComment): Promise<void> {
    try {
      await this.profileRepository.giveRating(comment);
    } catch (error) {
      throw error;
    }
  }

  async retrieveRatings(userId: string): Promise<IuserRating[]> {
    try {
      return await this.profileRepository.findAllRatings(userId);
    } catch (error) {
      throw error;
    }
  }
}
