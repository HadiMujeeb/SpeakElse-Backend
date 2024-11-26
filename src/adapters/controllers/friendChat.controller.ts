import { Request, Response, NextFunction } from "express";
import { IChat, IMessage } from "../../domain/entities/chat.entities";
import { IFriendChatController } from "../../interface/Icontrollers/IfriendChat.controller";
import FriendChatUseCase from "../../usecase/friendChat.usecase";
import { HttpStatus } from "../../domain/responseStatus/httpcode";
import { SuccessMessages } from "../../domain/responseMessages/successMessages";

export default class FriendChatController implements IFriendChatController {
    private FriendChatUsecase: FriendChatUseCase
    constructor(FriendChatUsecase: FriendChatUseCase) {
        this.FriendChatUsecase = FriendChatUsecase
    }
   async requestCreateChat(req: Request, res: Response, next: NextFunction): Promise<void> {
       try {
           const { userId, friendId } = req.body;
           const chat = await this.FriendChatUsecase.createChat(userId, friendId);
           res.status(HttpStatus.CREATED).json({message:SuccessMessages.CHAT_CREATED,chat});
       } catch (error) {
           next(error);
       }
   }
   async requestRetrieveAllChats(req: Request, res: Response, next: NextFunction): Promise<void> {
       try {
           const  {userId } = req.query as {userId: string};
           console.log("working",userId);
           const chats: IChat[] = await this.FriendChatUsecase.retrieveAllChats(userId);
           res.status(HttpStatus.OK).json({message:SuccessMessages.CHATS_RETRIEVED,chats});
       } catch (error) {
           next(error);
   }
}
async requestRetrieveChat(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { userId, friendId } = req.body;
        const chat: IChat|void = await this.FriendChatUsecase.retrieveChat(userId, friendId);
        res.status(HttpStatus.OK).json({message:SuccessMessages.CHAT_RETRIEVED,chat});
    } catch (error) {
        next(error);
    }
}
async requestSendMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const messageData:IMessage = req.body;
        console.log(messageData);
        await this.FriendChatUsecase.sendMessage(messageData);
        res.status(HttpStatus.OK).json({message:SuccessMessages.MESSAGE_SENT});
    } catch (error) {
        next(error);
    }
} 
}