import { PrismaClient } from "@prisma/client";
import {IuserRoomRepository} from "../../interface/Irepositories/IuserRoom.repository";
import { IReqestUserCreateRoom, IRoom } from "../../domain/entities/room.entities";
import { IUser } from "../../domain/entities/user.entities";
import { ITransaction } from "../../domain/entities/mentor.entities";


export default class userRoomRepository  implements IuserRoomRepository{

    private prisma: PrismaClient;
    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
        
    }


    async findUserById(id: string): Promise<IUser | null> {
        try {
          const userData = await this.prisma.user.findUnique({
            where: {
              id,
            },
          });
          return userData;
        } catch (err) {
          throw err;
        }
      }

async CreateUserRoom(data:IReqestUserCreateRoom): Promise<IRoom|void> {
    try {
    const createRoom =  await this.prisma.room.create({
            data:{
                creatorId:data.creatorId,
                topic:data.topic,
                level:data.level,
                privacy:data.privacy,
                maxPeople:data.maxPeople,
                language:data.language,
                participants:[],  
            },
            include:{creator:true}
        })
    return  createRoom
    } catch (error) {
        throw error
    }
}
// async retrieveAllRooms(page: number = 1, pageSize: number = 10): Promise<{ rooms: IRoom[]; total: number; totalPages: number }> {
//   try {
//     const skip = (page - 1) * pageSize;

//     const [rooms, total] = await this.prisma.$transaction([
//       this.prisma.room.findMany({
//         skip,
//         take: pageSize,
//         include: {
//           creator: true,
//         },
//       }),
//       this.prisma.room.count(),
//     ]);

//     return {
//       rooms,
//       total,
//       totalPages: Math.ceil(total / pageSize),
//     };
//   } catch (error) {
//     throw error;
//   }
// }
async retrieveAllRooms(): Promise<IRoom[]|void> {
  try {
   const allRoom = this.prisma.room.findMany({
   include:{creator:true}
   })
   return allRoom
  } catch (error) {
    throw error;
  }
}


async retrieveRoomById(roomId: string): Promise<IRoom[]> {
  try {
    const room = await this.prisma.room.findMany({
      where: {
        id: roomId,
      },
      include: {
        creator: true,
      },
    });
    return room;
  } catch (error) {
    throw error;
  }

}

async deleteRoom(roomId: string): Promise<void> {
  try {
      await this.prisma.room.delete({
          where: { id: roomId },
      });
  } catch (error) {
      throw error;
  }
}
}
