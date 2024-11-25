import express, { Router } from "express";
import userRoomController from "../../adapters/controllers/userRoom.controller";
import userRoomRepository from "../repository/userRoom.repository";
import userRoomUseCase from "../../usecase/userRoom.usecase";
import prisma from "../config/prismaCient.config";

const userRoomRoute: Router = express.Router();

const UserRoomRepository = new userRoomRepository(prisma);
const UserRoomUseCase = new userRoomUseCase(UserRoomRepository);
const UserRoomController = new userRoomController(UserRoomUseCase);

userRoomRoute.post("/createRoom",UserRoomController.requestCreateRoom.bind(UserRoomController));
userRoomRoute.get("/retrieveAllRooms",UserRoomController.requestRetrieveAllRooms.bind(UserRoomController)
);

export default userRoomRoute;
