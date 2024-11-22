import express, { Router } from "express";
import userProfileController from "../../adapters/controllers/userProfile.controller";
import userProfileRepository from "../repository/userProfile.repository";
import userProfileUseCase from "../../usecase/userProfile.usecase";
import { upload } from "../config/multer.config";
const profileRoute: Router = express.Router();

const UserProfileRepository = new userProfileRepository();
const UserProfileUseCase = new userProfileUseCase(UserProfileRepository);
const UserProfileController = new userProfileController(UserProfileUseCase);

profileRoute.post(
  "/updateMemberData",
  upload.single("image"),
  UserProfileController.requestEditMemberData.bind(UserProfileController)
);

export default profileRoute;
