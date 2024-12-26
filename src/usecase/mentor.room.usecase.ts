import IMentorRoomUseCase from "../interface/Iusecase/Imentor.room.usecase";
import MentorRoomRepository from "../infrastructure/repository/mentor.room.repository";
import { IMentorRoom, IStatus, ITransaction } from "../domain/entities/mentor.entities";
import { MentorSessionStatus } from "@prisma/client";
export default class MentorRoomUseCase implements IMentorRoomUseCase {
 private mentorRoomRepository: MentorRoomRepository
 constructor(mentorRoomRepository: MentorRoomRepository) {
    this.mentorRoomRepository = mentorRoomRepository
 }

 async CreateMentorRoom(data: IMentorRoom): Promise<IMentorRoom | void> {
    try {
        const createMentorRoom = await this.mentorRoomRepository.CreateMentorRoom(data);
        return createMentorRoom
    } catch (error) {
        throw error
    }
 }
 async updateMentorRoom(data: IMentorRoom): Promise<IMentorRoom | void> {
    try {
        const updateMentorRoom = await this.mentorRoomRepository.updateMentorRoom(data);
        return updateMentorRoom
    } catch (error) {
        throw error
    }
 }

  async requestGetAllRooms(): Promise<IMentorRoom[]> {
    try {
        const getAllRooms = await this.mentorRoomRepository.getAllRooms();
        return getAllRooms
    } catch (error) {
        throw error
    }
 }

 async cancelMentorSession(roomId: string, mentorId: string): Promise<void> {
    try {
     const transaction: ITransaction[] =  await this.mentorRoomRepository.findMentorRoomTransactions(roomId);
     if(transaction.length > 0){
        for (let index = 0; index < transaction.length; index++) {
           await this.mentorRoomRepository.updateUserWallet(transaction[index].userId, transaction[index].amount);
           await this.mentorRoomRepository.updateMentorWallet(mentorId, transaction[index].mentorAmount);
           await this.mentorRoomRepository.UpdateTransactionStatus(transaction[index].id, transaction[index].transactionId, IStatus.CANCELLED);
        }
     }
     await this.mentorRoomRepository.updateMentorSessionStatus(roomId, MentorSessionStatus.CANCELED);
    } catch (error) {
        throw error
    }
}

 async requestRescheduleMentorSession(roomId: string, startTime: Date, endTime: Date,reason: string): Promise<void> {
    try {
        await this.mentorRoomRepository.rescheduleMentorSession(roomId, startTime, endTime, reason);
    } catch (error) {
        throw error
    }
 }

 async getAllRoomsANDTransactionsByMentorId(mentorId: string): Promise<{ rooms: IMentorRoom[]; transactions: ITransaction[] }> {
    try {
        const rooms = await this.mentorRoomRepository.getAllRoomsByMentorId(mentorId);

        // Fetch transactions for all rooms concurrently
        const transactionPromises = rooms.map(room => 
         this.mentorRoomRepository.findMentorRoomTransactions(room.id)
        );

        // Resolve all transaction promises
        const transactionsArray = await Promise.all(transactionPromises);

        // Flatten the transactions array
        const transactions = transactionsArray.flat();

        // Return both rooms and transactions
        return { rooms, transactions };
    } catch (error) {
        throw error;
    }
}


}