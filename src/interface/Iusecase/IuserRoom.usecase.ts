import { ITransaction } from "../../domain/entities/mentor.entities";
import { IRoom } from "../../domain/entities/room.entities";

export default interface IuserRoomUseCase {
    createUserRoom(data:IRoom): Promise<void|IRoom>;
    retriveUserRoom(): Promise<IRoom[]|void>
    requestPaymentTransaction(data:ITransaction): Promise<void>
}

