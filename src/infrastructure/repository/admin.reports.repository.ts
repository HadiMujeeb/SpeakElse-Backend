import {  PrismaClient} from "@prisma/client";
import {IAdminReportsRepository} from "../../interface/Irepositories/Iadmin.reports.repository";
import { IResponseReport } from "../../domain/entities/user.entities";
import { IStatus, ITransaction } from "../../domain/entities/mentor.entities";

export default class adminReportsRepository implements IAdminReportsRepository {

    private prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

   async getAllReports(): Promise<IResponseReport[]|null> {
       try {
       const reports= await this.prisma.report.findMany({
           include: {
               reporter: true,
               reported: true,
           },
       });  
       return reports
       } 
       catch (error) {
           throw error;
       }
   }

   async updateReportStatus(reportId: string, status: string): Promise<void> {
       try {
           await this.prisma.report.update({
               where: { id: reportId },
               data: { status:status },
           });
       } catch (error) {
           throw error;
       }

}

async blockUnblockUser(userId: string): Promise<void> {
    try {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        await this.prisma.user.update({
            where: { id: userId },
            data: { isBlocked: !user?.isBlocked },
        });
    } catch (error) {
        throw error;
    }
} 

async getAllTransactions(): Promise<ITransaction[]> {
    try {
        const transactions = await this.prisma.transaction.findMany();
        return transactions
    } catch (error) {
        throw error
    }
}

async findSessionById(sessionId: string): Promise<any> {
    try {
        const session = await this.prisma.mentorSession.findUnique({ where: { id: sessionId } });
        return session
    } catch (error) {
        throw error
    }
}
}