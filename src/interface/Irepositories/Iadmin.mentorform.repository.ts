import IApplication from "../../domain/entities/mentor.entities";


export interface IAdminMentorFormRepository {
    getAllApplications(): Promise<IApplication[]>;
    updateMentorStatus(email: string): Promise<void>;
    updateApprovalStatus(email: string, status: string): Promise<void>;
}