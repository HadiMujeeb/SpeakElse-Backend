import { Request, Response, NextFunction } from "express";
import {IMentorRoomController} from "../../interface/Icontrollers/Imentor.room.controller";
import mentorRoomUseCase from "../../usecase/mentor.room.usecase";
import { IMentorRoom, IReshedulement } from "../../domain/entities/mentor.entities";
import { HttpStatus } from "../../domain/responseStatus/httpcode";
import { SuccessMessages } from "../../domain/responseMessages/successMessages";

export default class mentorRoomController implements IMentorRoomController {
    private mentorRoomUseCase: mentorRoomUseCase;

    constructor(mentorRoomUseCase: mentorRoomUseCase) {
        this.mentorRoomUseCase = mentorRoomUseCase  
    }

    async requestCreateRoom(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data: IMentorRoom = req.body;
            const createMentorRoom = await this.mentorRoomUseCase.createMentorRoom(data);
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


    async cancelMentorSession(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            console.log(req.body);
            const { roomId, mentorId } = req.body;
            await this.mentorRoomUseCase.cancelMentorSession(roomId, mentorId);
            res.status(HttpStatus.OK).json({ message: SuccessMessages.SESSION_CANCELLED });
        } catch (error) {
            next(error);
        }
    }


    async reqRescheduleMentorSession(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            console.log(req.body);
            const data:IReshedulement = req.body;
            await this.mentorRoomUseCase.requestRescheduleMentorSession(data.roomId, data.startTime, data.endTime, data.reason);
            res.status(HttpStatus.OK).json({ message: SuccessMessages.SESSION_RESCHEDULED });
        } catch (error) {
            next(error);
        }
    }

 async getAllRoomsANDTransactionsByMentorId(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const mentorId = req.params.id;
        console.log(mentorId);
        const { rooms , transactions} = await this.mentorRoomUseCase.getAllRoomsANDTransactionsByMentorId(mentorId);
        res.status(HttpStatus.OK).json({ message: SuccessMessages.ROOMS_RETRIEVED, rooms, transactions });
    } catch (error) {
        next(error);
    }
}
}