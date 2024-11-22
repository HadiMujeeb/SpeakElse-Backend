import { NextFunction, Request,Response } from "express"

export default interface IMentorProfileController {
    requestEditMentorData(req: Request, res: Response, next: NextFunction): Promise<void>
}