import express, { Router } from "express";
import { userAuthRepository } from "../repository/user.Auth.repository";
import UserAuthController from "../../adapters/controllers/user.auth.controller";
import UserAuthUseCase from "../../usecase/user.Auth.usecase";
import prisma from "../config/prismaCient.config";
import { PasswordService } from "../../domain/services/password.services";

import { MailerServices } from "../../domain/services/email.service";

import profileUsecase from "../../usecase/userProfile.usecase";
import OTPRepository from "../repository/Otp.Repository";
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
