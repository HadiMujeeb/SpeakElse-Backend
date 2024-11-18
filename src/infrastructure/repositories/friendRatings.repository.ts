import { PrismaClient } from "@prisma/client";
import IfriendRatingsRepository from "../../interface/Irepositories/IfriendRatings.repository";
import e from "express";
import { IComment } from "../../domain/entities/user.entities";



export default class FriendRatingsRepository implements IfriendRatingsRepository {
private prisma: PrismaClient

constructor(prisma: PrismaClient) {
    this.prisma = prisma;

}
 async findFriendinFollowing(userId: string): Promise<string[]> {
    try {
      const friend = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { following: true }, 
      });

      return friend ? friend.following : [];
    } catch (error) {
      throw error;
    }
  }
async followUnfollow(userId: string, friendId: string): Promise<void> {
    try {
        let friendExist = await this.findFriendinFollowing(userId)
        const isExisted = friendExist.find((id)=>id==friendId)
        if(!isExisted){
           await this.prisma.user.update({
                where:{id:userId},
                data:{following:{push:friendId}}
            })
        }else{
         await this.prisma.user.update({
                where:{id:userId},
                data:{following:{set:friendExist.filter((id)=>id!=friendId)}}
            })
        }
    
    } catch (error) {
       throw error 
    }
}
 async followerUnfollower(userId: string, friendId: string): Promise<void> {
    try {
        let friendExist = await this.findFriendinFollowing(userId)
        const isExisted = friendExist.find((id)=>id==friendId)
        if(!isExisted){
           await this.prisma.user.update({
                where:{id:userId},
                data:{followers:{push:friendId}}
            })
        }else{
         await this.prisma.user.update({
                where:{id:userId},
                data:{followers:{set:friendExist.filter((id)=>id!=friendId)}}
            })
        }
    } catch (error) {
        throw error
    }
}

async findAllfollowers(userId: string): Promise<string[]> {
    try {
      const friend = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { followers: true }, 
      });

      return friend ? friend.followers : [];
    } catch (error) {
      throw error;
    }
  }


  async findAllfollowings(userId: string): Promise<string[]> {
    try {
      const friend = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { following: true }, 
      });    
      return friend ? friend.following : [];
    } catch (error) {
      throw error;
    }
  }

  async giveRating(comment: IComment): Promise<void> {
    try {
        await this.prisma.comment.create({
            data:comment})
    } catch (error) {
        
    }
}

async findAllRatings(userId: string): Promise<IComment[]> {
    try {
        return await this.prisma.comment.findMany({where:{userId:userId}})
    } catch (error) {
        throw error
    }
}
}