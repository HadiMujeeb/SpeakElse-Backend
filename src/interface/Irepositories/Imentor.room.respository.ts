import { IMentorRoom } from "../../domain/entities/mentor.entities";

export default interface IMentorRoomRepository {
    CreateMentorRoom(data: IMentorRoom): Promise<IMentorRoom | void>;
    updateMentorRoom(data: IMentorRoom): Promise<IMentorRoom | void>;
    getAllRooms(): Promise<IMentorRoom[]>
    joinMentorRoom(roomId: string): Promise<void>;
    leaveMentorRoom(roomId: string): Promise<void>;
    bookedMentorRoom(roomId: string,userId: string): Promise<void>;
//     findMentorById(id: string): Promise<IUser | null>;
//     retrieveAllRooms(): Promise<>;
}