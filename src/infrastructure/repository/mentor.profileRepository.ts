import { PrismaClient } from "@prisma/client";
import { IComment, IUser } from "../../domain/entities/user.entities";
import {IMentorProfileRepository} from "../../interface/Irepositories/Imentor.profile.repository";
import IApplication from "../../domain/entities/mentor.entities";

export default class mentorProfileRepository
  implements IMentorProfileRepository
{
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async updateMentorData(mentorData: IApplication): Promise<IApplication> {
    try {
     return await this.prisma.mentor.update({
        where: { email: mentorData.email },
        data: {
          name: mentorData.name,
          country: mentorData.country,
          mentorRole: mentorData.mentorRole,
          avatar: mentorData.avatar,
          language: mentorData.language,
          description: mentorData.description,
        },
      });
    } catch (error) {
      throw error;
    }
  }
  async getfeedbackRatings(mentorId: string): Promise<IComment[]> {
    try {
      const comments = await this.prisma.comment.findMany({
        where: { userId: mentorId },
        include: { givenUser: true },
      });
      const ratings = comments.forEach((comment: any) => {
        if (comment.rating > 0) {
          return {
            userId: comment.userId,
            feedback: comment.feedback,
            rating: comment.rating,
            givenBy: comment.givenUser.name,
            createdAt: comment.createdAt,
          };
        }
      })
      return ratings??[];
    } catch (error) {
      throw error;
    }
  }
}
