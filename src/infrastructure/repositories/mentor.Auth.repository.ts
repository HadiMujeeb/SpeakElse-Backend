import { PrismaClient } from "@prisma/client";
import IApplication from "../../domain/entities/mentor.entities";
import IMentorAuthRepository from "../../interface/Irepositories/Imentor.auth.repository";
import { IComment, IUser } from "../../domain/entities/user.entities";

export default class mentorAuthRepository implements IMentorAuthRepository {
  private prisma: PrismaClient;
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }
  async findUserById(id: string): Promise<IComment[]> {
    try {
      const userComments = await this.prisma.user.findUnique({
        where: {
          id,
        },
        include: {
          comments: true,
        },
      });
      return userComments?.comments ?? [];
    } catch (err) {
      throw err;
    }
  }

  async createMentorshipApplication(data: IApplication): Promise<void> {
    try {
      await this.prisma.mentorApplication.create({
        data: {
          userId: data.id,
          email: data.email,
          name: data.name,
          subject: data.subject,
          message: data.message,
          proficiencyLevel: "beginner",
          ratings: data.ratings,
          feedbacks: data.feedbacks,
          resume: data.resume,
        },
      });
    } catch (error) {
      throw error;
    }
  }
}
