import { Express, Request, Response, NextFunction } from "express";
import { IUserWalletController } from "../../interface/Icontrollers/Iuser.Wallet.controller";
import UserWalletUseCase from "../../usecase/user.Wallet.usecase";
import { HttpStatus } from "../../domain/responseStatus/httpcode";
import { SuccessMessages } from "../../domain/responseMessages/successMessages";
import { ITransaction } from "../../domain/entities/mentor.entities";
export default class UserWalletController implements IUserWalletController {
    private UserWalletUseCase: UserWalletUseCase
    constructor(UserWalletUseCase: UserWalletUseCase) {
        this.UserWalletUseCase = UserWalletUseCase;
    }
    async requestGellAllTransactions(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.query.userId
            console.log(userId)
            const {transactions,rooms} = await this.UserWalletUseCase.getAllTransations(req.params.id)
            res.status(HttpStatus.OK).json({message:"Transactions retrieved successfully.",transactions,rooms})
        } catch (error) {
            next(error)
        }
    }

    async requestPaymentTransation(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
          const data: ITransaction = req.body
          console.log(data);
          await this.UserWalletUseCase.requestPaymentTransaction(data);
          res.status(HttpStatus.OK).json({message: SuccessMessages.PAYMENT_SUCCESS})
        } catch (error) {
          next(error)
        }
      } 

   async requestRefundSessionAmount(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const data: ITransaction = req.body
        console.log(data);
        await this.UserWalletUseCase.refundSessionAmount(data);
        res.status(HttpStatus.OK).json({message: SuccessMessages.REFUND_SUCCESS})
      } catch (error) {
        next(error)
      }
   }   
}