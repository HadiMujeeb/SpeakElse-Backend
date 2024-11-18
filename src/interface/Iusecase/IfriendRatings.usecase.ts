import { IComment } from "../../domain/entities/user.entities";


export default interface IFriendRatingsUseCase {
    followUnfollow(userId: string, friendId: string): Promise<void>;
    // followerUnfollower(userId: string, friendId: string): Promise<void>;
    retriveFollowerFollowing(userId: string): Promise<{following:string[],followers:string[]}>;
    giveRating(comment: IComment): Promise<void>;
    retrieveRatings(userId: string): Promise<IComment[]>
}