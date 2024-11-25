import { IRoom } from "../../domain/entities/room.entities";
import { IUser } from "../../domain/entities/user.entities";


export default interface IuserRoomRepository {
    CreateUserRoom(data:IRoom): Promise<IRoom|void>;
    findUserById(id: string): Promise<IUser | null>;
    retrieveAllRooms(): Promise<IRoom[]>;
}