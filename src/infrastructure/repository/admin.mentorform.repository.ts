import IApplication from "../../domain/entities/mentor.entities";
import { ApprovalStatus, PrismaClient } from "@prisma/client";
import { IAdminMentorFormRepository } from "../../interface/Irepositories/Iadmin.mentorform.repository";

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
            data: { approvalStatus:ApprovalStatus[status as keyof typeof ApprovalStatus] }, 
          });
      }catch (error) {
        throw error;
      }
    }
}