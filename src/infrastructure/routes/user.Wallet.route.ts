import express,{ Router } from "express";

import UserWalletController from "../../adapters/controllers/user.Wallet.controller";
import UserWalletUseCase from "../../usecase/user.Wallet.usecase";
import UserWalletRepository from "../repository/user.Wallet.repository";
import prisma from "../config/prismaCient.config";
import { use } from "passport";

const userWalletRoute: Router = express.Router();

const userWalletRepository = new UserWalletRepository(prisma);
const userWalletUseCase = new UserWalletUseCase(userWalletRepository);
const userWalletController = new UserWalletController(userWalletUseCase);


userWalletRoute.get("/requestGetAllTransactions", userWalletController.requestGellAllTransactions.bind(userWalletController));
userWalletRoute.post("/requestPaymentTransation", userWalletController.requestPaymentTransation.bind(userWalletController));
userWalletRoute.post("/requestRefundSessionAmount", userWalletController.requestRefundSessionAmount.bind(userWalletController));
export default userWalletRoute;