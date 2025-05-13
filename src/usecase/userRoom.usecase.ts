import {IuserRoomUseCase} from "../interface/Iusecase/IuserRoom.usecase";
import userRoomRepository from "../infrastructure/repository/userRoom.repository";
import { IReqestUserCreateRoom, IRoom, IUserCreatedRoom } from "../domain/entities/room.entities";
import { HttpStatus } from "../domain/responseStatus/httpcode";
import { ErrorMessages } from "../domain/responseMessages/errorMessages";
import { ITransaction } from "../domain/entities/mentor.entities";

export default class userRoomUseCase implements IuserRoomUseCase {
  private userRoomRepository: userRoomRepository;
  constructor(userRoomRepository: userRoomRepository) {
    this.userRoomRepository = userRoomRepository;
  }
  async createUserRoom(data: IReqestUserCreateRoom): Promise<IUserCreatedRoom|void> {
    try {
      const responseData = await this.userRoomRepository.CreateUserRoom(data);
      if (!responseData) return;
      console.log("data",responseData)
      const createRoom: IUserCreatedRoom = {
        id: responseData.id,
        language: responseData.language,
        topic: responseData.topic??'',
        peopleCount: {
          joined:0,
          limit:parseInt(responseData.maxPeople),
        },
        level: responseData.level,
        privacy: responseData.privacy,
        participants: responseData.participants,
        createdAt:responseData.createdAt,
        creator: {
          id: responseData.creator?.id ?? '',
          name: responseData.creator?.name ?? '',
          country: responseData.creator?.country ?? '',
          profession: responseData.creator?.profession ?? '',
          avatar: responseData.creator?.avatar ?? ''          
        }
      };
      
      return createRoom
    } catch (error) {
      throw error;
    }
  }
  // async retriveUserRoom(page: number, pageSize: number): Promise<{ rooms: IRoom[]; total: number; totalPages: number }> {
  //   try {
  //     const rooms = await this.userRoomRepository.retrieveAllRooms(page, pageSize);
  //     if (!rooms) {
  //       throw { message: "rooms not found", status: HttpStatus.NOT_FOUND };
  //     }
  //     return rooms;
  //   } catch (error) {
  //     throw error;
  //   }
 // In your service or controller
async retriveUserRoom(): Promise<IUserCreatedRoom[] | void> {
  try {
    const rooms = await this.userRoomRepository.retrieveAllRooms();
    if (!rooms) return [];
    const transformedRooms: IUserCreatedRoom[] = rooms.map((room) => ({
      id: room.id,
      topic: room.topic ?? '',
      language: room.language,
      level: room.level,
      peopleCount: {
        joined:0,
        limit:parseInt(room.maxPeople),
      },
      privacy: room.privacy,
      participants: room.participants,
      createdAt: room.createdAt,
      creator: {
        id: room.creator?.id?? '',
        name: room.creator?.name?? '',
        country: room.creator?.country??'',
        profession: room.creator?.profession??'',
        avatar: room.creator?.avatar ?? ''       
      },
    }));

    return transformedRooms;
  } catch (error) {
    throw error;
  }
}


  async retrieveRoomById(roomId: string): Promise<IRoom[]> {
    try {
      const room = await this.userRoomRepository.retrieveRoomById(roomId);
      return room;
    } catch (error) {
      throw error;
    }
  }
  
}
