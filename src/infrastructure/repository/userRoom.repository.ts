import { PrismaClient } from "@prisma/client";
import IuserRoomRepository from "../../interface/Irepositories/IuserRoom.repository";
import { IRoom } from "../../domain/entities/room.entities";
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

async CreateUserRoom(data:IRoom): Promise<IRoom|void> {
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
            }
        })
    return  createRoom
    } catch (error) {
        throw error
    }
}
async retrieveAllRooms(): Promise<IRoom[]> {
  try {
    const roomData = await this.prisma.room.findMany({
      include: {
        creator: true,
      },
    });
    return roomData;
  } catch (error) {
    throw error;
  }
}
async createPaymentTransaction(data: ITransaction): Promise<void> {
  try {
    await this.prisma.transaction.create({
      data: {
        userId: data.userId,
        fundReceiverId: data.fundReceiverId,
        amount: data.amount,
        type: data.type,
        status: data.status,
        transactionId: data.transactionId,
        paymentMethod: data.paymentMethod,
        sessionId: data.sessionId,
        description: data.description
      }
    })
  } catch (error) {
    throw error
  }
}

async bookedMentorRoom(roomId: string, userId: string): Promise<void> {
  try {
    const joinMentorRoom = await this.prisma.mentorSession.update({
      where:{ id:roomId },
      data:{ participants: { push: userId } }
    })  
  } catch (error) {
      throw error
  }
}
}
