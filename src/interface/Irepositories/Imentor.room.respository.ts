import { IMentorRoom, ITransaction } from "../../domain/entities/mentor.entities";

export default interface IMentorRoomRepository {
    CreateMentorRoom(data: IMentorRoom): Promise<IMentorRoom | void>;
    updateMentorRoom(data: IMentorRoom): Promise<IMentorRoom | void>;
    getAllRooms(): Promise<IMentorRoom[]>;
    joinMentorRoom(roomId: string): Promise<void>;
    leaveMentorRoom(roomId: string): Promise<void>;
    bookedMentorRoom(roomId: string, userId: string): Promise<void>;
    findMentorRoomTransactions(roomId: string): Promise<ITransaction[]>;
    updateUserWallet(userId: string, amount: number): Promise<void>;
    updateMentorWallet(mentorId: string, amount: number): Promise<void>;
    UpdateTransactionStatus(id: string,transactionId: string,status: string): Promise<void>;
    updateMentorSessionStatus(roomId: string, status: string): Promise<void>;
    rescheduleMentorSession(roomId: string, startTime: Date, endTime: Date,reason: string): Promise<void>;
}