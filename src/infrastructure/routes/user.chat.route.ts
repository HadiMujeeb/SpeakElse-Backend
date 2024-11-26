import express, { Router } from "express";

import FriendChatController from "../../adapters/controllers/friendChat.controller";
import FriendChatUseCase from "../../usecase/friendChat.usecase";
import FriendChatRepository from "../repository/friendChat.repository";
import prisma from "../config/prismaCient.config";

const friendChatRepository = new FriendChatRepository(prisma);
const friendChatUseCase = new FriendChatUseCase(friendChatRepository);
const friendChatController = new FriendChatController(friendChatUseCase);


const FriendChatRoute: Router = express.Router();

FriendChatRoute.post("/createChat", friendChatController.requestCreateChat.bind(friendChatController));
FriendChatRoute.get("/retrieveAllChats", friendChatController.requestRetrieveAllChats.bind(friendChatController));
FriendChatRoute.post("/retrieveChat", friendChatController.requestRetrieveChat.bind(friendChatController));
FriendChatRoute.post("/sendMessage", friendChatController.requestSendMessage.bind(friendChatController));

export default FriendChatRoute