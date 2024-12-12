import IAdminMentorFormUsecase from "../interface/Iusecase/Iadmin.mentorform.usecase";
import AdminMentorFormRepository from "../infrastructure/repository/admin.mentorform.repository";
import IApplication from "../domain/entities/mentor.entities";
export default class AdminMentorFormUseCase implements IAdminMentorFormUsecase {
  private adminMentorFormRepository: AdminMentorFormRepository 
  constructor(adminMentorFormRepository: AdminMentorFormRepository) {
    this.adminMentorFormRepository = adminMentorFormRepository;
  }

  async  getAllApplications(): Promise<IApplication[]> {
       try {
         const applications = await this.adminMentorFormRepository.getAllApplications();
         return applications;
       } catch (error) {
         throw error;
       } 
    }

  async updateApprovalStatus(email: string, status: string): Promise<void> {
    try {
      await this.adminMentorFormRepository.updateApprovalStatus(email, status);
    } catch (error) {
      throw error;
    }
  }

  async updateMentorStatus(email: string): Promise<void> {
    try {
      await this.adminMentorFormRepository.updateMentorStatus(email);
    } catch (error) {
      throw error;
    }
  }
}