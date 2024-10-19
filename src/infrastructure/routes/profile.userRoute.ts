import express, { Router } from "express";
import userProfileController from "../../adapters/controller/userprofile.controller";
import userProfileRepository from "../repositories/userProfileRepository";
import userProfileUseCase from "../../usecase/userProfileUsecase";
import upload from "../middlewares/multerMiddleware";
const profileRoute: Router = express.Router();



const UserProfileRepository = new userProfileRepository();
const UserProfileUseCase  = new userProfileUseCase(UserProfileRepository);
const UserProfileController = new userProfileController(UserProfileUseCase);

profileRoute.put('/updateMemberData', upload.single("image"),UserProfileController.requestEditMemberData.bind(UserProfileController));

export default profileRoute;