
import userWalletRepository from "../infrastructure/repository/user.Wallet.repository";
import { IMentorRoom, IStatus, ITransaction } from "../domain/entities/mentor.entities";
import {IUserWalletUseCase} from "../interface/Iusecase/Iuser.wallet.usecase";

export default class userWalletUseCase implements IUserWalletUseCase {
    private userWalletRepository: userWalletRepository;
    constructor(userWalletRepository: userWalletRepository) {
        this.userWalletRepository = userWalletRepository;
    }

    async getAllTransations(userId: string): Promise<{ transactions: ITransaction[]; rooms: IMentorRoom[]}>
    {
        try {
            const transactions = await this.userWalletRepository.getAllTransations(userId);
            const rooms = await this.userWalletRepository.getUserIncludeRoom(userId);
            return {transactions,rooms}
        } catch (error) {
            throw error
     }
    }
    async requestPaymentTransaction(data: ITransaction): Promise<void> {
        try {
          await this.userWalletRepository.createPaymentTransaction(data);
          await this.userWalletRepository.bookedMentorRoom(data.sessionId,data.userId);
          await this.userWalletRepository.paymentofMentor(data.mentorId||'',data.amount);
        } catch (error) {
          throw error
        }
      }

  async refundSessionAmount(data: ITransaction): Promise<void> {
    try {

      await this.userWalletRepository.refundSessionAmount(data.userId, data.amount);
      await this.userWalletRepository.refundAmountFromMentor(data.mentorId!, data.amount);
      await this.userWalletRepository.updateTransactionStatus(data.id,  data.transactionId,IStatus.REFUNDED );
      await this.userWalletRepository.unbookedMentorRoom(data.sessionId,data.userId)
    } catch (error) {
      throw error;
    }
  }


}