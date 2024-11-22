import express, { Router } from "express";

import friendRatingsController from "../../adapters/controllers/friendRatings.controller";
import friendRatingsRepository from "../repository/friendRatings.repository";
import friendRatingsUseCase from "../../usecase/friendRatings.usecase";
import prisma from "../config/prismaCient.config";

const FriendRatingsRepository = new friendRatingsRepository(prisma);
const FriendRatingsUseCase = new friendRatingsUseCase(FriendRatingsRepository);
const FriendRatingsController = new friendRatingsController(
  FriendRatingsUseCase
);

const FriendRatingsRoute: Router = express.Router();

FriendRatingsRoute.post(
  "/requestFollowUnfollow",
  FriendRatingsController.requestFollowUnfollow.bind(FriendRatingsController)
);
FriendRatingsRoute.get(
  "/requestRetrieveFriends",
  FriendRatingsController.requestRetrieveFollowingsFollowers.bind(
    FriendRatingsController
  )
);

FriendRatingsRoute.post(
  "/requestGiveRating",
  FriendRatingsController.requestGiveRating.bind(FriendRatingsController)
);
FriendRatingsRoute.get(
  "/requestRetrieveRatings",
  FriendRatingsController.requestRetrieveRatings.bind(FriendRatingsController)
);

export default FriendRatingsRoute;
