import { Request, Response, NextFunction } from "express";
import IMentorRoomController from "../../interface/Icontrollers/Imentor.room.controller";
import MentorRoomUseCase from "../../usecase/mentor.room.usecase";
import { IMentorRoom } from "../../domain/entities/mentor.entities";
import { HttpStatus } from "../../domain/responseStatus/httpcode";
import { SuccessMessages } from "../../domain/responseMessages/successMessages";

export default class MentorRoomController implements IMentorRoomController {
    private mentorRoomUseCase: MentorRoomUseCase;

    constructor(mentorRoomUseCase: MentorRoomUseCase) {
        this.mentorRoomUseCase = mentorRoomUseCase  
    }

    async requestCreateRoom(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data: IMentorRoom = req.body;
            const createMentorRoom = await this.mentorRoomUseCase.CreateMentorRoom(data);
            console.log(createMentorRoom);
            res.status(HttpStatus.CREATED).json({message: SuccessMessages.ROOM_CREATED,room:createMentorRoom});
        } catch (error) {
            next(error);
        }
    }

    async requestUpdateRoom(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data: IMentorRoom = req.body;
            const updateMentorRoom = await this.mentorRoomUseCase.updateMentorRoom(data);
            res.status(HttpStatus.OK).json({message: SuccessMessages.ROOM_UPDATED,room:updateMentorRoom});
        } catch (error) {
            next(error);
        }
    }

    async requestGetAllRooms(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const allRooms = await this.mentorRoomUseCase.requestGetAllRooms();
            res.status(HttpStatus.OK).json({message: SuccessMessages.ROOMS_RETRIEVED,rooms:allRooms});
        } catch (error) {
            next(error);
        }
    }
}