import express, { Router } from "express";
import { userAuthRepository } from "../repositories/user.Auth.repository";
import UserAuthController from "../../adapters/controller/user.auth.controller";
import UserAuthUseCase from "../../usecase/user.Auth.usecase";
import prisma from "../config/PrismaCient";
import { PasswordService } from "../../domain/thirdParty/passwordServices";

import { MailerServices } from "../../domain/thirdParty/emailService";

import profileUsecase from "../../usecase/userProfileUsecase";
import OTPRepository from "../repositories/Otp.Repository";
import { authorize } from "passport";
const router: Router = express.Router();

// Instantiate services and use cases
const mailerServices = new MailerServices();
const OtpRepository = new OTPRepository(prisma);
const UserAuthRepository = new userAuthRepository(prisma);
const passwordService = new PasswordService();
const userAuthUseCase = new UserAuthUseCase(
  UserAuthRepository,
  mailerServices,
  passwordService,
  OtpRepository
);

const AuthuserController = new UserAuthController(userAuthUseCase);


// Routes
router.post(
  "/registerUser",
  AuthuserController.UserRegistrationRequest.bind(AuthuserController)
);
router.post(
  "/verifyOtp",
  AuthuserController.confirmOtpRequest.bind(AuthuserController)
);
router.post(
  "/loginUser",
  AuthuserController.UserLoginRequest.bind(AuthuserController)
);
router.get(
  "/logout",
  AuthuserController.UserLogoutRequest.bind(AuthuserController)
);
router.get(
  "/verify-Token",
  AuthuserController.authenticateTokenRequest.bind(AuthuserController)
);
router.post(
  "/resend-OTP",
  AuthuserController.resendOTPRequest.bind(AuthuserController)
);
router.post(
  "/sendEmailReset",
  AuthuserController.requestSentMailResetPassword.bind(AuthuserController)
);
router.post(
  "/resetPassword",
  AuthuserController.requestResetPassword.bind(AuthuserController)
);


export default router;
