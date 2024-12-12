import { Request, Response, NextFunction } from "express";
import IAdminMentorFormController from "../../interface/Icontrollers/Iadmin.mentorform.controller";
import adminMentorFormUsecase from "../../usecase/admin.mentorform.usecase";
import { http } from "winston";
import { HttpStatus } from "../../domain/responseStatus/httpcode";
import { SuccessMessages } from "../../domain/responseMessages/successMessages";
export default class AdminMentorFormController implements IAdminMentorFormController {
    private mentorFormUsecase: adminMentorFormUsecase;
    constructor(mentorFormUsecase: adminMentorFormUsecase) {
        this.mentorFormUsecase = mentorFormUsecase;        
    }   
    async getAllApplications(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const applications = await this.mentorFormUsecase.getAllApplications();
            res.status(HttpStatus.OK).json({message:SuccessMessages.APPLICATIONS_RETRIEVED,applications});
        } catch (error) {
            next(error);
        }
    }
    async updateMentorStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email } = req.body;
            await this.mentorFormUsecase.updateMentorStatus(email);
            res.status(HttpStatus.OK).json({ message:SuccessMessages.MENTOR_STATUS_UPDATED });
        } catch (error) {
            next(error);
        }
    }
    async updateApprovalStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email, status } = req.body;
            console.log(email,status);
            await this.mentorFormUsecase.updateApprovalStatus(email, status);
            res.status(HttpStatus.OK).json({ message:SuccessMessages.APPLICATION_STATUS_UPDATED });
        } catch (error) {
            next(error);
        }
    }
}