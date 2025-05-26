import { IMentorRoom, ITransaction } from "../../domain/entities/mentor.entities";
import { IWalletRepository } from "../../interface/Irepositories/Iuser.Wallet.repository";
import { PrismaClient } from "@prisma/client";
export default class userWalletRepository implements IWalletRepository {
private prisma: PrismaClient;
constructor(prisma: PrismaClient) {
    this.prisma = prisma;
}
//  async cancelTransaction(transactionId: string): Promise<ITransaction> {
     
//  }

 async getAllTransations(userId: string): Promise<ITransaction[]> {
     try {
         const transations = await this.prisma.transaction.findMany({
             where: {
                 userId: userId
             },
         })
         return transations
     } catch (error) {
         throw error  
     }
 }

 async getUserIncludeRoom(userId: string): Promise<IMentorRoom[]> {
  try {
    console.log(userId);
    const rooms = await this.prisma.mentorSession.findMany({});
    return rooms;
  } catch (error) {
    console.error(error);
    throw error;
  }
} async createPaymentTransaction(data: ITransaction): Promise<void> {
    const mentorAmount = data.amount * 0.4; 
    const adminAmount = data.amount * 0.6;  
    
    try {
      await this.prisma.transaction.create({
        data: {
          userId: data.userId,
          fundReceiverId: data.fundReceiverId,
          mentorAmount: mentorAmount,
          adminAmount: adminAmount,
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
  async unbookedMentorRoom(roomId: string, userId: string): Promise<void> {
  try {
    const room = await this.prisma.mentorSession.findUnique({
      where: { id: roomId },
      select: { participants: true }
    });
    if (!room) throw new Error('Room not found');
    const updatedParticipants = room.participants.filter((id: string) => id !== userId);
    await this.prisma.mentorSession.update({
      where: { id: roomId },
      data: { participants: updatedParticipants }
    });
  } catch (error) {
    throw error;
  }
}


  
  async paymentofMentor(mentorId: string, amount: number): Promise<void> {
    try {
      const mentorAmount = amount * 0.4;
     await this.prisma.mentorWallet.update({
       where:{ mentorId:mentorId },
       data:{ balance: { increment: mentorAmount } }
     })
    } catch (error) {
      throw error  
    }
  }


  async cancelMentorSession(roomId: string, userId: string): Promise<void> {
    try {
      const session = await this.prisma.mentorSession.findUnique({
        where: { id: roomId },
        select: { participants: true }, 
      });
  
      if (!session) throw new Error('Session not found');
      const updatedParticipants = session.participants.filter((id:string) => id !== userId);
      await this.prisma.mentorSession.update({
        where: { id: roomId },
        data: { participants: updatedParticipants },
      });
    } catch (error) {
      throw error;
    }
  }

  async refundSessionAmount(userId: string, amount: number): Promise<void> {
    try {
      await this.prisma.userWallet.update({
        where: { userId: userId },
        data: { balance: { increment: amount } },
      });
    } catch (error) {
      throw error;
    }
} 

async refundAmountFromMentor(mentorId: string, amount: number): Promise<void> {
  try {
    const mentorAmount = amount * 0.4;
    const data =await this.prisma.mentorWallet.update({
      where: { mentorId: mentorId },
      data: { balance: { decrement: mentorAmount } },
    });
  } catch (error) {
    throw error;
  }
}

  async updateTransactionStatus(id: string, transactionId: string, status: string): Promise<void> {
    try {
      await this.prisma.transaction.update({
        where: { id: id, transactionId: transactionId },
        data: { status: status },
      });
    } catch (error) {
      throw error
    }
  }

  


}