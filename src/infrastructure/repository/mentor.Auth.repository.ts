import {PrismaClient } from "@prisma/client";
import IApplication from "../../domain/entities/mentor.entities";
import IMentorAuthRepository from "../../interface/Irepositories/Imentor.auth.repository";
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
  
  async findMentorByEmail(email: string): Promise<IApplication|null> {
    try {
      const userData = await this.prisma.mentor.findUnique({
        where: {
          email,
        },
        include:{mentorWallet:true}
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
        include:{mentorWallet:true}
      });
      return userData;
    } catch (err) {
      throw err;
    }
  }
  
}
