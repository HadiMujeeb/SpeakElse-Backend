import {Request,Response, NextFunction } from "express"


export interface IAdminController {
    adminLogin(req: Request,res: Response,next: NextFunction): Promise<void | never>
    adminAuthTokenRequest(req: Request, res: Response, next: NextFunction): Promise<void>
    adminLogoutRequest(req: Request, res: Response, next: NextFunction): Promise<void>
}