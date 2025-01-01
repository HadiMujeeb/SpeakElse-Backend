import { PrismaClient } from "@prisma/client";
import IUserProfileRepository from "../../interface/Irepositories/IuserProfile.repository";
import { IComment, IReport, IUser, IuserRating } from "../../domain/entities/user.entities";

export default class userProfileRepository implements IUserProfileRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async doesUserExist(memberId: string): Promise<boolean> {
    try {
      return !!this.prisma.user.findUnique({
        where: { id: memberId },
        select: { id: true },
      });
    } catch (error) {
      throw error;
    }
  }

  async updateUserData(MemberData: IUser): Promise<void> {
    try {
      await this.prisma.user.update({
        where: { id: MemberData.id },
        data: {
          name: MemberData.name,
          email: MemberData.email,
          country: MemberData.country,
          profession: MemberData.profession,
          avatar: MemberData.avatar,
          language: MemberData.language,
          description: MemberData.description,
        },
      });
    } catch (error) {
      throw error;
    }
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
        let friendExist = await this.findAllfollowers(userId)
        const isExisted = friendExist.find((id:any)=>id==friendId)
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


  async findAllFriends(friends: string[]): Promise<IUser[]> {
    try {
      const users = await this.prisma.user.findMany({
        where: { id: { in: friends } },
      });
      return users;
  
    } catch (error) {
      throw error;
    }
  }

  async giveRating(comment: IComment): Promise<void> {
    try {
        await this.prisma.comment.create({
            data:{
                userId:comment.userId,
                givenBy:comment.givenBy,
                feedback:comment.feedback,
                rating:comment.rating,
                createdAt:new Date()
            }})
    } catch (error) {
        
    }
}

async findAllRatings(userId: string): Promise<IuserRating[]> {
  try {
    const comments = await this.prisma.comment.findMany({
      where: { userId: userId },
      include: { givenUser: true },
    });
    const ratings: IuserRating[]  = comments
      .filter((comment:any) => comment.rating > 0) 
      .map((comment) => ({
        feedback: comment.feedback,
        rating: comment.rating,
        givenBy: {
          id: comment.givenUser.id,
          name: comment.givenUser.name,
          avatar: comment.givenUser.avatar ??'',
        },
        createdAt: comment.createdAt,
      }));
    return ratings;
  } catch (error) {
    throw error;
  }
}

async getAllQuestions(): Promise<any> {
  try {
      const data = await this.prisma.questions.findMany({
          select: {
              id: true,
              testType: true,
              title: true,
              story: true,
              questions: true,
          },
      });
  
 return data
  } catch (error) {
      throw error;
  }
}

async reportUser(report:IReport): Promise<void> {
  try {
    await this.prisma.report.create({
      data: {
        reporterId: report.reporterId,
        reportedId: report.reportedId,
        content: report.content,
        proof: report.proof
      },
    })
  } catch (error) {
    throw error
  }
}
}
