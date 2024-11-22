import express, { Router } from "express";

import mentorProfileRepository from "../repository/mentor.profileRepository";
import mentorProfileUseCase from "../../usecase/mentorProfile.usecase";
import mentorProfileController from "../../adapters/controllers/mentorProfile.controller";
import { upload } from "../config/multer.config";
const MentorProfileRoute: Router = express.Router();

const MentorProfileRepository = new mentorProfileRepository();
const MentorProfileUseCase = new mentorProfileUseCase(MentorProfileRepository);
const MentorProfileController = new mentorProfileController(
  MentorProfileUseCase
);

MentorProfileRoute.put(
  "/updateMentorData",
  upload.single("image"),
  MentorProfileController.requestEditMentorData.bind(MentorProfileController)
);

export default MentorProfileRoute;
