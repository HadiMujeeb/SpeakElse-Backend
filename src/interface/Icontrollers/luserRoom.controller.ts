import { Request, Response,NextFunction } from "express";

export default interface IuserRoomController {
    requestCreateRoom(req:Request,res:Response,next:NextFunction):Promise<void>
    requestRetrieveAllRooms(req:Request,res:Response,next:NextFunction):Promise<void>
    requestRetrieveRoomById(req: Request, res: Response, next: NextFunction): Promise<void>
}