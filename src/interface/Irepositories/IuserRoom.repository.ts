import { ITransaction } from "../../domain/entities/mentor.entities";
import { IRoom } from "../../domain/entities/room.entities";
import { IUser } from "../../domain/entities/user.entities";


export default interface IuserRoomRepository {
    CreateUserRoom(data:IRoom): Promise<IRoom|void>;
    findUserById(id: string): Promise<IUser | null>;
    retrieveAllRooms(page: number, pageSize: number): Promise<{ rooms: IRoom[]; total: number; totalPages: number }>
}