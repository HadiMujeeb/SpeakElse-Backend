import { Request, Response, NextFunction } from "express";
import {IAdminReportsController} from "../../interface/Icontrollers/Iadmin.reports.constroller";
import {IuserProfileController} from "../../interface/Icontrollers/IuserProfile.controller";
import adminReportsUseCase from "../../usecase/admin.reports.usecase";
import { HttpStatus } from "../../domain/responseStatus/httpcode";
import { ITransaction } from "../../domain/entities/mentor.entities";

export default class adminReportsController implements IAdminReportsController {
    private adminReportsUseCase: adminReportsUseCase;
    constructor(adminReportsUseCase: adminReportsUseCase) {
        this.adminReportsUseCase = adminReportsUseCase; 
    }

 async requestRetrieveAllReports(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const reports = await this.adminReportsUseCase.getAllReports();
        res.status(HttpStatus.OK).json({ message: "Reports retrieved successfully.", data: reports });
    } catch (error) {
        next(error);
    }
 }

 async requestStatusUpdate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const reportId = req.body.reportId;
        const status = req.body.status;
        console.log(reportId, status);
        await this.adminReportsUseCase.updateReportStatus(reportId, status);
        res.status(HttpStatus.OK).json({ message: "Report status updated successfully." });
    } catch (error) {
        next(error);
    }
 }

 async requestBlockUnblockUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const userId = req.body.userId;
        await this.adminReportsUseCase.blockUnblockUser(userId);
        res.status(HttpStatus.OK).json({ message: "User blocked/unblocked successfully." });
    } catch (error) {
        next(error);
    }
 }

 async requestGellAllTransactions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const transactions: ITransaction[] = await  this.adminReportsUseCase.gellAllTransactions();
        res.status(HttpStatus.OK).json({ message: "Transactions retrieved successfully.", data: transactions });
    } catch (error) {
        next(error);
 }
}
}