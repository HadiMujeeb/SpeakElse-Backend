import { Request, Response, NextFunction } from "express";
import IuserRoomController from "../../interface/Icontrollers/luserRoom.controller";
import { IRoom } from "../../domain/entities/room.entities";
import userRoomUseCase from "../../usecase/userRoom.usecase";
import { HttpStatus } from "../../domain/responseStatus/httpcode";
import { SuccessMessages } from "../../domain/responseMessages/successMessages";

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
  async  requestRetrieveAllRooms(req: Request, res: Response, next: NextFunction): Promise<void> {
          try {
            const rooms = await this.userRoomUseCase.retriveUserRoom();
            res.status(HttpStatus.OK).json(rooms)
          } catch (error) {
            next(error)
          }
      }
}