import { Request, Response, NextFunction } from "express";

export interface IAdminMentorFormController {
    getAllApplications(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateMentorStatus(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateApprovalStatus(req: Request, res: Response, next: NextFunction): Promise<void>;
    sendedApplicationMail(req: Request, res: Response, next: NextFunction): Promise<void>
}