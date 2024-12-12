import { ApprovalStatus, PrismaClient } from "@prisma/client";
import IApplication from "../../domain/entities/mentor.entities";
import IMentorAuthRepository from "../../interface/Irepositories/Imentor.auth.repository";
import { IComment, IUser } from "../../domain/entities/user.entities";
import bcrypt from "bcryptjs";
import prisma from "../config/prismaCient.config";
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
          userId: data.userId,
          approvalStatus: ApprovalStatus.PENDING
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
          userId: data.userId,
          approvalStatus: ApprovalStatus.PENDING,
          mentorWallet:{
            create:{
              balance:0
            }
          }
          
        }
      });
    } catch (error) {
      throw error; 
    }
  }
  
  async findMentorByEmail(email: string): Promise<IApplication | null> {
    try {
      const userData = await this.prisma.mentor.findUnique({
        where: {
          email,
        },
      });
      return userData;
    } catch (err) {
      throw err;
    }
  }

  async findMentorById(id: string): Promise<IApplication | null> {
    try {
      const userData = await this.prisma.mentor.findUnique({
        where: {
          id,
        },
      });
      return userData;
    } catch (err) {
      throw err;
    }
  }
  
}
