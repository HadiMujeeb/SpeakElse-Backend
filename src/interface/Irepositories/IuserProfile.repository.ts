import { IComment, IReport, IUser, IuserRating } from "../../domain/entities/user.entities";

export interface IUserProfileRepository {
    updateUserData(MemberData: IUser): Promise<void> | never;
    followUnfollow(userId: string, friendId: string): Promise<void>;
    followerUnfollower(userId: string, friendId: string): Promise<void>;
    findFriendinFollowing(userId: string, friendId: string): Promise<string[]>;
    findAllfollowings(userId: string): Promise<string[]>
    findAllfollowers(userId: string): Promise<string[]>
    giveRating(comment: IComment): Promise<void>;
    findAllRatings(userId: string): Promise<IuserRating[]>
    reportUser(report:IReport): Promise<void>
}
