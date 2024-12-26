import { ITransaction } from "../../domain/entities/mentor.entities";

export interface IWalletRepository {
    getAllTransations(userId: string): Promise<ITransaction[]>
    createPaymentTransaction(data: ITransaction): Promise<void>
    bookedMentorRoom(roomId: string, userId: string): Promise<void>
    paymentofMentor(mentorId: string, amount: number): Promise<void>
    cancelMentorSession(roomId: string, userId: string): Promise<void>

}