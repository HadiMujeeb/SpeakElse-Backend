import { IMentorRoom } from "../../domain/entities/mentor.entities";

export interface IMentorRoomUseCase {
    createMentorRoom(data: IMentorRoom): Promise<IMentorRoom | void>;
    updateMentorRoom(data: IMentorRoom): Promise<IMentorRoom | void>;
    requestGetAllRooms(): Promise<IMentorRoom[]>
}