import express, { Router } from "express";
import { upload } from "../config/multer.config";

import MentorAuthController from "../../adapters/controllers/mentor.auth.controller";
import MentorAuthUseCase from "../../usecase/mentor.auth.usecase";
import mentorAuthRepository from "../repository/mentor.Auth.repository";
import prisma from "../config/prismaCient.config";

const MentorAuthRepository = new mentorAuthRepository(prisma);
const mentorAuthUseCase = new MentorAuthUseCase(MentorAuthRepository);
const mentorAuthController = new MentorAuthController(mentorAuthUseCase);

const MentorAuthRoute: Router = express.Router();

MentorAuthRoute.post(
  "/registerApplication",
  upload.single("resume"),
  mentorAuthController.MentorApplicationRequest.bind(mentorAuthController)
);

export default MentorAuthRoute;
