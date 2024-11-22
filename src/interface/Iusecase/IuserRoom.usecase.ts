import { IRoom } from "../../domain/entities/room.entities";

export default interface IuserRoomUseCase {
    createUserRoom(data:IRoom): Promise<void|IRoom>;
    retriveUserRoom(): Promise<IRoom[]|void>
}

