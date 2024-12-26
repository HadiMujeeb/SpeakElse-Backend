import express, { Router } from "express";
import userProfileController from "./src/adapters/controllers/userProfile.controller";
import userProfileRepository from "./src/infrastructure/repository/userProfile.repository";
import userProfileUseCase from "./src/usecase/userProfile.usecase";
import { upload } from "./src/infrastructure/config/multer.config";

const profileRoute: Router = express.Router();

const UserProfileRepository = new userProfileRepository();
const UserProfileUseCase = new userProfileUseCase(UserProfileRepository);
const UserProfileController = new userProfileController(UserProfileUseCase);

profileRoute.post("/updateMemberData", upload.single("image"), UserProfileController.requestEditUserData.bind(UserProfileController));
profileRoute.post("/requestFollowUnfollow", UserProfileController.requestFollowUnfollow.bind(UserProfileController));
profileRoute.get("/requestRetrieveFriends", UserProfileController.requestRetrieveFollowingsFollowers.bind(UserProfileController));
profileRoute.post("/requestGiveRating", UserProfileController.requestGiveRating.bind(UserProfileController));
profileRoute.get("/requestRetrieveRatings", UserProfileController.requestRetrieveRatings.bind(UserProfileController));
profileRoute.get("/getAllQuestions", UserProfileController.requestgetAllQuestions.bind(UserProfileController));
profileRoute.post("/requestreportUser",upload.single("proof"), UserProfileController.requestReportUser.bind(UserProfileController));

export default profileRoute