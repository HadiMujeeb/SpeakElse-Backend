import {Request,Response, NextFunction } from "express"

export default  interface IAdminReportsController {
    requestRetrieveAllReports(req: Request, res: Response, next: NextFunction): Promise<void>
    requestStatusUpdate(req: Request, res: Response, next: NextFunction): Promise<void>
    requestBlockUnblockUser(req: Request, res: Response, next: NextFunction): Promise<void>
    requestGellAllTransactions(req: Request, res: Response, next: NextFunction): Promise<void>
    // requestResolveReport(req: Request, res: Response, next: NextFunction): Promise<void>
}