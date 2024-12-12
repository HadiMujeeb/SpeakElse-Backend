import { IMentorRoom } from "../../domain/entities/mentor.entities";

export default interface IMentorRoomUseCase {
    CreateMentorRoom(data: IMentorRoom): Promise<IMentorRoom | void>;
    updateMentorRoom(data: IMentorRoom): Promise<IMentorRoom | void>;
    requestGetAllRooms(): Promise<IMentorRoom[]>
}