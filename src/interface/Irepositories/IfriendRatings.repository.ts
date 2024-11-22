import { IComment } from "../../domain/entities/user.entities";

export default interface IfriendRatingsRepository {
    followUnfollow(userId: string, friendId: string): Promise<void>;
    followerUnfollower(userId: string, friendId: string): Promise<void>;
    findFriendinFollowing(userId: string, friendId: string): Promise<string[]>;
    findAllfollowings(userId: string): Promise<string[]>
    findAllfollowers(userId: string): Promise<string[]>
    giveRating(comment: IComment): Promise<void>;
    findAllRatings(userId: string): Promise<IComment[]>
}