import { IComment, IUser, IuserRating } from "../../domain/entities/user.entities";

export default interface IUserProfileUseCase {
  handleEditUserData(memberData: IUser): Promise<void>;
  followUnfollow(userId: string, friendId: string): Promise<void>;
  // followerUnfollower(userId: string, friendId: string): Promise<void>;
  retriveFollowerFollowing(userId: string): Promise<{following:IUser[],followers:IUser[]}>;
  giveRating(comment: IComment): Promise<void>;
  retrieveRatings(userId: string): Promise<IuserRating[]>
}
