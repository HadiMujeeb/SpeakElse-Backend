import { Request, Response, NextFunction } from "express";
import IuserRoomController from "../../interface/Icontrollers/luserRoom.controller";
import { IRoom } from "../../domain/entities/room.entities";
import userRoomUseCase from "../../usecase/userRoom.usecase";
import { HttpStatus } from "../../domain/responseStatus/httpcode";
import { SuccessMessages } from "../../domain/responseMessages/successMessages";
import { ITransaction } from "../../domain/entities/mentor.entities";

export default class userRoomController implements IuserRoomController {

    private userRoomUseCase: userRoomUseCase
    constructor(userRoomUseCase: userRoomUseCase) {
        this.userRoomUseCase = userRoomUseCase
    }
  async requestCreateRoom(req: Request, res: Response, next: NextFunction): Promise<void> {
         try {
            const data: IRoom = req.body
           const createRoom = await this.userRoomUseCase.createUserRoom(data);
            res.status(HttpStatus.CREATED).json({message: SuccessMessages.ROOM_CREATED,room:createRoom})
         } catch (error) {
            next(error)
         }
     }
     async requestRetrieveAllRooms(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const page = parseInt(req.query.page as string, 10) || 1; 
        const pageSize = parseInt(req.query.pageSize as string, 10) || 6;
        
        const result = await this.userRoomUseCase.retriveUserRoom(page, pageSize);
    
        res.status(HttpStatus.OK).json({
          message: 'Rooms retrieved successfully.',
          rooms: result.rooms,
          total: result.total,  
          totalPages: result.totalPages,
        });
      } catch (error) {
        next(error);
      }
    }
      
      
}