import IApplication from "../../domain/entities/mentor.entities";

export default interface IAdminMentorFormUsecase {
    getAllApplications(): Promise<IApplication[]>;
    updateMentorStatus(email: string): Promise<void>;
    updateApprovalStatus(email: string, status: string): Promise<void>;
    sendedApplicationMail(email: string,status:string): Promise<void>
}