import {Request,Response, NextFunction } from "express";
export interface IAdminUserMgmtController {
    requestRetrieveAllMembersList(req: Request, res: Response,next:NextFunction): Promise<void>;
    requestToggleMemberBlocking(req: Request, res: Response,next:NextFunction): Promise<void>;
    requestUpdateMemberDetails(req: Request, res: Response,next:NextFunction): Promise<void>;
    requestAddMember(req: Request, res: Response,next:NextFunction): Promise<void>
}