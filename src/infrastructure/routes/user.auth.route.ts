import express, { Router } from "express";
import { userAuthRepository } from "../repository/user.Auth.repository";
import UserAuthController from "../../adapters/controllers/user.auth.controller";
import UserAuthUseCase from "../../usecase/user.Auth.usecase";
import prisma from "../config/prismaCient.config";
import { PasswordService } from "../../domain/services/password.services";
import { MailerServices } from "../../domain/services/email.service";

const router: Router = express.Router();

// Instantiate services and use cases
const mailerServices = new MailerServices();
const UserAuthRepository = new userAuthRepository(prisma);
const passwordService = new PasswordService();
const userAuthUseCase = new UserAuthUseCase(UserAuthRepository, mailerServices, passwordService);
const AuthuserController = new UserAuthController(userAuthUseCase);

// Routes
router.post("/registerUser", AuthuserController.userRegistrationRequest.bind(AuthuserController));
router.post("/verifyOtp", AuthuserController.confirmOtpRequest.bind(AuthuserController));
router.post("/loginUser", AuthuserController.userLoginRequest.bind(AuthuserController));
router.post("/google-login", AuthuserController.userGoogleLoginRequest.bind(AuthuserController));
router.get("/logout", AuthuserController.userLogoutRequest.bind(AuthuserController));
router.get("/verify-Token", AuthuserController.authenticateTokenRequest.bind(AuthuserController));
router.post("/resend-OTP", AuthuserController.resendOTPRequest.bind(AuthuserController));
router.post("/sendEmailReset", AuthuserController.requestSentMailResetPassword.bind(AuthuserController));
router.post("/resetPassword", AuthuserController.requestResetPassword.bind(AuthuserController));

export default router;
