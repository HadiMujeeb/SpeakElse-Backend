import express, { Router } from "express";
import { upload } from "../config/multer.config";

import MentorAuthController from "../../adapters/controllers/mentor.auth.controller";
import MentorAuthUseCase from "../../usecase/mentor.auth.usecase";
import mentorAuthRepository from "../repository/mentor.Auth.repository";
import prisma from "../config/prismaCient.config";
import { PasswordService } from "../../domain/services/password.services";
const passwordService = new PasswordService();
const MentorAuthRepository = new mentorAuthRepository(prisma);
const mentorAuthUseCase = new MentorAuthUseCase(MentorAuthRepository, passwordService);
const mentorAuthController = new MentorAuthController(mentorAuthUseCase);

const MentorAuthRoute: Router = express.Router();

MentorAuthRoute.post("/registerApplication",upload.fields([
    { name: "resume", maxCount: 1 },
    { name: "avatar", maxCount: 1 },
]),mentorAuthController.MentorApplicationRequest.bind(mentorAuthController));

export default MentorAuthRoute;
