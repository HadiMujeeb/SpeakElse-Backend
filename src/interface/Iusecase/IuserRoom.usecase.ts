import { ITransaction } from "../../domain/entities/mentor.entities";
import { IReqestUserCreateRoom, IRoom, IUserCreatedRoom } from "../../domain/entities/room.entities";

export interface IuserRoomUseCase {
    createUserRoom(data:IReqestUserCreateRoom): Promise<IUserCreatedRoom|void>;
    retriveUserRoom(): Promise<IUserCreatedRoom[]|void>
}

