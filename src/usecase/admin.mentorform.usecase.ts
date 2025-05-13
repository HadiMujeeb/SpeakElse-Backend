import {IAdminMentorFormUsecase} from "../interface/Iusecase/Iadmin.mentorform.usecase";
import adminMentorFormRepository from "../infrastructure/repository/admin.mentorform.repository";
import IApplication from "../domain/entities/mentor.entities";
import { MailerServices } from "../domain/services/email.service";
export default class adminMentorFormUseCase implements IAdminMentorFormUsecase {
  private adminMentorFormRepository: adminMentorFormRepository
  private mailerServices: MailerServices

  constructor(adminMentorFormRepository: adminMentorFormRepository, mailerServices: MailerServices) {
    this.adminMentorFormRepository = adminMentorFormRepository;
    this.mailerServices = mailerServices

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

  async sendedApplicationMail(email: string,status:string): Promise<void> {
    try {
      if(status == "REJECTED"){
        console.log(status,"status");
        await this.mailerServices.ApplicationFormStatusMail(email, status);
      }else{
        console.log(status,"status");
        await this.mailerServices.ApplicationFormStatusMail(email, status);
      }
      await this.adminMentorFormRepository.sendedApplicationMail(email);
    } catch (error) {
      throw error;
    }
  }
}