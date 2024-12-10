import { Request, Response,NextFunction } from "express";
import { IQuestions } from "../../domain/entities/tests.entites";

export interface IAdminTestsController {
    requestgetAllQuestions(req: Request, res: Response, next: NextFunction): Promise<void>;
    requestaddQuestion(req: Request, res: Response, next: NextFunction): Promise<void>;
    requesteditQuestion(req: Request, res: Response, next: NextFunction): Promise<void>;
    requestremoveQuestion(req: Request, res: Response, next: NextFunction): Promise<void>;
}