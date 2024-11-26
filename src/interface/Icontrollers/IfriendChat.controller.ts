import { IChat } from "../../domain/entities/chat.entities";
import { Express,Request,Response,NextFunction } from "express";
export interface IFriendChatController {
    requestCreateChat(req: Request, res: Response, next: NextFunction): Promise<void>
    requestRetrieveAllChats(req: Request, res: Response, next: NextFunction): Promise<void>
    requestRetrieveChat(req: Request, res: Response, next: NextFunction): Promise<void>
    requestSendMessage(req: Request, res: Response, next: NextFunction): Promise<void>
}