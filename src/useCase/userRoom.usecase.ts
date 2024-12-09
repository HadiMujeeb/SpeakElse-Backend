import IuserRoomUseCase from "../interface/Iusecase/IuserRoom.usecase";
import userRoomRepository from "../infrastructure/repositories/userRoom.repository";
import { IRoom } from "../domain/entities/room.entities";
import { HttpStatus } from "../domain/responseStatus/httpcode";
import { ErrorMessages } from "../domain/responseMessages/errorMessages";

export default class userRoomUseCase implements IuserRoomUseCase {
   private userRoomRepository: userRoomRepository;
   constructor(userRoomRepository: userRoomRepository) {
       this.userRoomRepository = userRoomRepository
   }
    async createUserRoom(data:IRoom): Promise<void|IRoom> {
        try {
            console.log("room wwdwdwdwdata",data)
            // const isUserExist = await this.userRoomRepository.findUserById(data.creatorId);
            // if(!isUserExist) {
            //     throw {status:HttpStatus.NOT_FOUND,message:ErrorMessages.USER_NOT_FOUND}
            // }
           const createRoom = await this.userRoomRepository.CreateUserRoom(data);
            return createRoom
        } catch (error) {
            throw error
        }
    }
 
 async retriveUserRoom(): Promise<IRoom[]|void> {
    try {
        const rooms = await this.userRoomRepository.retrieveAllRooms();
        if(!rooms){
            throw {message:'rooms not found',status:HttpStatus.NOT_FOUND}
        }
        return rooms
    } catch (error) {
       throw error 
    }
}

 
    
}