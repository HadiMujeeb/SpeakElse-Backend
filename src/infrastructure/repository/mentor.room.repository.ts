import {  PrismaClient } from "@prisma/client";
import {IMentorRoomRepository} from "../../interface/Irepositories/Imentor.room.respository";
import { IMentorRoom, ITransaction } from "../../domain/entities/mentor.entities";

export default class mentorRoomRepository implements IMentorRoomRepository {
    private prisma: PrismaClient

    constructor(prisma: PrismaClient) {
        this.prisma = prisma
    }

async createMentorRoom(data: IMentorRoom): Promise<IMentorRoom | void> {
    return await this.prisma.mentorSession.create({
        data:{
            mentorId:data.mentorId,
            language:data.language,
            topic:data.topic,
            limit:data.limit,
            participants:data.participants,
            startTime:data.startTime,
            endTime:data.endTime,
            bookingFee:data.bookingFee,
        }
    })
}

async updateMentorRoom(data: IMentorRoom): Promise<IMentorRoom | void> {
    return await this.prisma.mentorSession.update({
        where:{id:data.id},
        data:{
            language:data.language,
            topic:data.topic,
            limit:data.limit,
            participants:data.participants,
            startTime:data.startTime,
            endTime:data.endTime
        }
    })
}

async getAllRooms(): Promise<IMentorRoom[]> {
    try {
        return await this.prisma.mentorSession.findMany({
            include:{mentor:true}
        })
    } catch (error) {
      throw error  
    }
}

async joinMentorRoom(roomId: string): Promise<void> {
    try {
      const joinMentorRoom = await this.prisma.mentorSession.update({
        where:{ id:roomId },
        data:{ limit: { increment: 1 } }
      })  
    } catch (error) {
        throw error
    }
}

async leaveMentorRoom(roomId: string): Promise<void> {
    try {
      const leaveMentorRoom = await this.prisma.mentorSession.update({
        where:{ id:roomId },
        data:{ limit: { decrement: 1 } }
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

async findMentorRoomTransactions(roomId: string): Promise<ITransaction[]> {
    try {
        const transactions = await this.prisma.transaction.findMany({
            where: { sessionId: roomId },
        });

        return transactions ?? [];
    } catch (error) {
        
        throw error
    }
}


async updateUserWallet(userId: string, amount: number): Promise<void> {
    try {
        await this.prisma.userWallet.update({
            where: { userId: userId },
            data: { balance: { increment: amount } },
        });
    } catch (error) {
        throw error
    }
}

async updateMentorWallet(mentorId: string, amount: number): Promise<void> {
    try {
        await this.prisma.mentorWallet.update({
            where: { mentorId: mentorId },
            data: { balance: { decrement: amount } },
        });
    } catch (error) {
        throw error
    }
}

async UpdateTransactionStatus(id: string, transactionId: string, status: string): Promise<void> {
    try {
        await this.prisma.transaction.update({
            where: { id: id },
            data: { status: status },
        });
    } catch (error) {
        throw error
    }
}

async updateMentorSessionStatus(roomId: string, status: string): Promise<void> {
    try {
        await this.prisma.mentorSession.update({
            where: { id: roomId },
            data: { status: status },
        });
    } catch (error) {
        throw error
    }
}


async rescheduleMentorSession(
    roomId: string, startTime: Date, endTime: Date,reason: string
  ): Promise<void> {
    try {
      await this.prisma.mentorSession.update({
        where: { id: roomId },
        data: {
         rescheduleCount: { increment: 1 },
         rescheduleReason: { push: reason },
          startTime: startTime,
          endTime: endTime,
        },
      });
    } catch (error) {
      throw error;
    }
  }
  
 async getAllRoomsByMentorId(mentorId: string): Promise<IMentorRoom[]> {
    try {
        return await this.prisma.mentorSession.findMany({
            where: { mentorId: mentorId },
        });
    } catch (error) {
        throw error;
    }
  }


}