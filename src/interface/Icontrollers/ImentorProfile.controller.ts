import { NextFunction, Request,Response } from "express"

export interface IMentorProfileController {
    requestEditMentorData(req: Request, res: Response, next: NextFunction): Promise<void>
    requestGetFeedbackRatings(req: Request, res: Response, next: NextFunction): Promise<void>
}