import express, { Router } from "express";
import { userAuthRepository } from "../repositories/user.Auth.repository";
import UserAuthController from "../../adapters/controller/user.auth.controller";
import UserAuthUseCase from "../../usecase/user.Auth.usecase";
import prisma from "../config/PrismaCient";
import { PasswordService } from "../../domain/thirdParty/passwordServices";

import { MailerServices } from "../../domain/thirdParty/emailService";
import profileController from "../../adapters/controller/profileController";
import profileRepository from "../repositories/profileRepository";
import profileUsecase from "../../usecase/profileUsecase";
import OTPRepository from "../repositories/Otp.Repository";
const router: Router = express.Router();

// Instantiate services and use cases
const mailerServices= new MailerServices();
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
const ProfileRepository = new profileRepository();
const ProfileUsecase = new profileUsecase(ProfileRepository);
const ProfileController = new profileController(ProfileUsecase);

// Routes
router.post("/registerUser",AuthuserController.UserRegistrationRequest.bind(AuthuserController));
router.post("/verifyOtp",AuthuserController.confirmOtpRequest.bind(AuthuserController));
router.post("/login", AuthuserController.UserLoginRequest.bind(AuthuserController));
// router.get(
//   "/verifyToken",
//   AuthuserController.verifyToken.bind(AuthuserController)
// );
router.get("/logout", AuthuserController.UserLogoutRequest.bind(AuthuserController));
// router.put("/profile", ProfileController.editprofile.bind(ProfileController));

export default router;
