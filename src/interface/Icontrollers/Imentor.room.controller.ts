import {Request,Response, NextFunction } from "express";

export default interface IMentorRoomController {
    requestCreateRoom(req: Request, res: Response, next: NextFunction): Promise<void>;
    requestUpdateRoom(req: Request, res: Response, next: NextFunction): Promise<void>;
    requestGetAllRooms(req: Request, res: Response, next: NextFunction): Promise<void>;
    // requestJoinRoom(req:Request,res:Response,next:NextFunction):Promise<void>
    //     requestLeaveRoom(req:Request,res:Response,next:NextFunction):Promise<void>
    // requestRetrieveAllRooms(req: Request, res: Response, next: NextFunction): Promise<void>;
}