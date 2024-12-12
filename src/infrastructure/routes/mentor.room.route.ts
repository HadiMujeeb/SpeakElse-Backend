import express,{Router} from "express";

import MentorRoomController from "../../adapters/controllers/mentor.room.controller";
import MentorRoomUseCase from "../../usecase/mentor.room.usecase";
import MentorRoomRepository from "../repository/mentor.room.repository";
import prisma from "../config/prismaCient.config";

const mentorRoomRoute:Router = express.Router();
const mentorRoomRepository = new MentorRoomRepository(prisma);
const mentorRoomUseCase = new MentorRoomUseCase(mentorRoomRepository);
const mentorRoomController = new MentorRoomController(mentorRoomUseCase);

mentorRoomRoute.post("/requestcreateRoom",mentorRoomController.requestCreateRoom.bind(mentorRoomController));
mentorRoomRoute.put("/requestupdateRoom",mentorRoomController.requestUpdateRoom.bind(mentorRoomController));
mentorRoomRoute.get("/requestgetAllRooms",mentorRoomController.requestGetAllRooms.bind(mentorRoomController));

export default mentorRoomRoute;