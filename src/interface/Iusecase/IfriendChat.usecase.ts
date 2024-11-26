import { IChat, IMessage } from "../../domain/entities/chat.entities";


export interface IFriendChatUsecase {
    createChat(userId: string, friendId: string): Promise<IChat | void>;
    retrieveAllChats(userId: string): Promise<IChat[] | void>;
    retrieveChat(userId: string, friendId: string): Promise<IChat | void>;
    sendMessage(data:IMessage): Promise<void>;
    // retrieveChatById(chatId: string): Promise<IChat | void>;
}