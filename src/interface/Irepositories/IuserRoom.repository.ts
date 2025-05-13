import { IReqestUserCreateRoom, IRoom } from "../../domain/entities/room.entities";
import { IUser } from "../../domain/entities/user.entities";


export interface IuserRoomRepository {
    CreateUserRoom(data:IReqestUserCreateRoom): Promise<IRoom|void>;
    findUserById(id: string): Promise<IUser | null>;
    retrieveAllRooms(): Promise<IRoom[]|void>
    retrieveRoomById(roomId: string): Promise<IRoom[]>;
    deleteRoom(roomId: string): Promise<void>; 
}