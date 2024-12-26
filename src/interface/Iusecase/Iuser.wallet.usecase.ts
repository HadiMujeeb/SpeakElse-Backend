import { IMentorRoom, ITransaction } from "../../domain/entities/mentor.entities";

export default interface IUserWalletUseCase {
    refundSessionAmount(data: ITransaction): Promise<void>
    getAllTransations(userId: string): Promise<{ transactions: ITransaction[] | null; rooms: IMentorRoom[] | null }>;

    requestPaymentTransaction(data: ITransaction): Promise<void>
}