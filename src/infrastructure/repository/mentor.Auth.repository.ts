import { PrismaClient } from "@prisma/client";
import IApplication from "../../domain/entities/mentor.entities";
import IMentorAuthRepository from "../../interface/Irepositories/Imentor.auth.repository";
import { IComment, IUser } from "../../domain/entities/user.entities";
import bcrypt from "bcryptjs";
export default class mentorAuthRepository implements IMentorAuthRepository {
  private prisma: PrismaClient;
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async createMentorshipApplication(data: IApplication): Promise<void> {
    try {
      await this.prisma.mentor.upsert({
        where: {
          email: data.email, 
        },
        update: {
          name: data.name,
          email: data.email,
          password: data.password,
          country: data.country,
          mentorRole: data.mentorRole,
          avatar: data.avatar,
          language: data.language,
          description: data.description,
          resume: data.resume,
          userId: data.userId
        },
        create: {
          name: data.name,
          email: data.email,
          password: data.password,
          country: data.country,
          mentorRole: data.mentorRole,
          avatar: data.avatar,
          language: data.language,
          description: data.description,
          resume: data.resume,
          userId: data.userId
        }
      });
    } catch (error) {
      throw error; 
    }
  }
  
}
