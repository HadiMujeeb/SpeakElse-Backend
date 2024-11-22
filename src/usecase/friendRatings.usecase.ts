import { IComment } from "../domain/entities/user.entities";
import FriendRatingsRepository from "../infrastructure/repository/friendRatings.repository";
import IFriendRatingsUseCase from "../interface/Iusecase/IfriendRatings.usecase";

export default class FriendRatingsUseCase implements IFriendRatingsUseCase {
  private friendRatingsRepository: FriendRatingsRepository;
  constructor(friendRatingsRepository: FriendRatingsRepository) {
    this.friendRatingsRepository = friendRatingsRepository;
  }

  async followUnfollow(userId: string, friendId: string): Promise<void> {
    try {
      await this.friendRatingsRepository.followUnfollow(userId, friendId);
      await this.friendRatingsRepository.followerUnfollower(friendId, userId);
    } catch (error) {
      throw error;
    }
  }

  // async followerUnfollower(userId: string, friendId: string): Promise<void> {
  //     try {
  //         await this.friendRatingsRepository.followerUnfollower(userId,friendId);
  //     } catch (error) {
  //         throw error
  //     }
  // }

  async retriveFollowerFollowing(
    userId: string
  ): Promise<{ following: string[]; followers: string[] }> {
    try {
      const following: string[] =
        await this.friendRatingsRepository.findAllfollowings(userId);
      const followers: string[] =
        await this.friendRatingsRepository.findAllfollowers(userId);
      return { following, followers };
    } catch (error) {
      throw error;
    }
  }

  async giveRating(comment: IComment): Promise<void> {
    try {
      await this.friendRatingsRepository.giveRating(comment);
    } catch (error) {
      throw error;
    }
  }

  async retrieveRatings(userId: string): Promise<IComment[]> {
    try {
      return await this.friendRatingsRepository.findAllRatings(userId);
    } catch (error) {
      throw error;
    }
  }
}
