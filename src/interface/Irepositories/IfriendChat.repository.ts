import { IChat, IMessage } from "../../domain/entities/chat.entities";

export interface IFriendChatRepository {
    createChat(userId: string, friendId: string): Promise<IChat | void>;
    retrieveAllChats(userId: string): Promise<IChat[] | void>;
    retrieveChatById(chatId: string): Promise<IChat | void>;
    sendMessage(data:IMessage): Promise<IChat | void>;
}