import { PrismaClient } from "@prisma/client";
import IMentorRoomRepository from "../../interface/Irepositories/Imentor.room.respository";
import { IMentorRoom } from "../../domain/entities/mentor.entities";

export default class MentorRoomRepository implements IMentorRoomRepository {
    private prisma: PrismaClient

    constructor(prisma: PrismaClient) {
        this.prisma = prisma
    }

async CreateMentorRoom(data: IMentorRoom): Promise<IMentorRoom | void> {
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
}