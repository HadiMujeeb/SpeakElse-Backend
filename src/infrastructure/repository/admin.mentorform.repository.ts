import IApplication from "../../domain/entities/mentor.entities";
import { PrismaClient } from "@prisma/client";
import { IAdminMentorFormRepository } from "../../interface/Irepositories/Iadmin.mentorform.repository";
import { IApprovalStatus } from "../../domain/entities/admin.entities";

export default class AdminMentorFormRepository implements IAdminMentorFormRepository {
    
    private prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;        
    }
    async getAllApplications(): Promise<IApplication[]> {
        try {
          const applications = await this.prisma.mentor.findMany(
            {
              
              include: {
                user: {
                    include:{comments:true}
                }
              }
            }
          );
          return applications;
        } catch (error) {
          throw error;
        }
      }
    
    async updateMentorStatus(email: string): Promise<void> {
      try {
        const mentor = await this.prisma.mentor.findUnique({ where: { email } });
        if (!mentor) {
          throw new Error("Mentor not found");
        }
        await this.prisma.mentor.update({
          where: { email },
          data: { isVerified: { set: !mentor.isVerified } }, 
        });
      } catch (error) {
        
      }
      }
    
      async updateApprovalStatus(email: string, status: string): Promise<void> {
        try {
          const mentor = await this.prisma.mentor.findUnique({ where: { email } });
          if (!mentor) {
            throw new Error("Mentor not found");
          }
          await this.prisma.mentor.update({
            where: { email },
            data: { approvalStatus:status }, 
          });
      }catch (error) {
        throw error;
      }
    }

  async sendedApplicationMail(email: string): Promise<void> {
    try {
      await this.prisma.mentor.update({
        where: { email },
        data: { isMailSend:1 },
      })
    } catch (error) {
      throw error
    }
  }
}