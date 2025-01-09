import { IAdminReportsUseCase } from "../interface/Iusecase/Iadmin.reports.usecase";
import AdminReportsRepository from "../infrastructure/repository/admin.reports.repository";
import { IResponseReport } from "../domain/entities/user.entities";
import { ITransaction } from "../domain/entities/mentor.entities";
export default class AdminReportsUseCase implements IAdminReportsUseCase {
    private adminReportsRepository: AdminReportsRepository
    constructor(adminReportsRepository: AdminReportsRepository) {
        this.adminReportsRepository = adminReportsRepository;
    }

    async  getAllReports(): Promise<IResponseReport[] | null> {
        try {
            return await this.adminReportsRepository.getAllReports()
        } catch (error) {
            throw error;
        }
    }

    async updateReportStatus(reportId: string, status: string): Promise<void> {
        try {
            await this.adminReportsRepository.updateReportStatus(reportId, status);
        } catch (error) {
            throw error;
        }
    }

    async blockUnblockUser(userId: string): Promise<void> {
        try {
            await this.adminReportsRepository.blockUnblockUser(userId);
        } catch (error) {
            throw error;
        }
    }
    
    async gellAllTransactions(): Promise<ITransaction[]> {
        try {
            const transactions = await this.adminReportsRepository.getAllTransactions();
            for (const transaction of transactions) {
                const session = await this.adminReportsRepository.findSessionById(transaction.sessionId);
                transaction.sessionDetails = session;
            }
            return transactions
        } catch (error) {
            throw error;
        }
    }
}