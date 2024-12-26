import {Request, Response, NextFunction } from "express";

export interface IUserWalletController {
    requestGellAllTransactions(req: Request, res: Response, next: NextFunction): Promise<void>;
}