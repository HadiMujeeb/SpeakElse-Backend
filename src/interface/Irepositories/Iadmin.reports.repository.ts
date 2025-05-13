import { ITransaction } from "../../domain/entities/mentor.entities";
import { IResponseReport } from "../../domain/entities/user.entities";


export interface IAdminReportsRepository {
    getAllReports(limit: number, offset: number): Promise<IResponseReport[] | null>
    updateReportStatus(reportId: string, status: string): Promise<void>
    blockUnblockUser(userId: string): Promise<void>;
    getAllTransactions(): Promise<ITransaction[]>;
}