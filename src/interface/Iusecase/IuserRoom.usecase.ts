import { ITransaction } from "../../domain/entities/mentor.entities";
import { IRoom } from "../../domain/entities/room.entities";

export default interface IuserRoomUseCase {
    createUserRoom(data:IRoom): Promise<void|IRoom>;
    retriveUserRoom(page: number, pageSize: number): Promise<{ rooms: IRoom[]; total: number; totalPages: number }>
}

