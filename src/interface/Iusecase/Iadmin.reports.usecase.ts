import { IResponseReport } from "../../domain/entities/user.entities";

export interface IAdminReportsUseCase {
    getAllReports(): Promise<IResponseReport[] | null>;
    updateReportStatus(reportId: string, status: string): Promise<void>;
    blockUnblockUser(userId: string): Promise<void>;
    gellAllTransactions(): Promise<any>
}