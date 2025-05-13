import { IChat, IMessage } from "../domain/entities/chat.entities";
import { IFriendChatUsecase } from "../interface/Iusecase/IfriendChat.usecase";
import friendChatRepository from "../infrastructure/repository/friendChat.repository";

export default class friendChatUseCase implements IFriendChatUsecase {
    private friendChatRepository: friendChatRepository
    constructor(friendChatRepository: friendChatRepository) {
        this.friendChatRepository = friendChatRepository
    }
   async createChat(userId: string, friendId: string): Promise<IChat> {
        try {
            const chat = await this.friendChatRepository.createChat(userId, friendId);
            const user= await this.friendChatRepository.findUserById(friendId);
            if(!user){
                throw new Error("User not found")
            }
            chat.friend = {id:user.id,name:user.name,avatar:user.avatar} as {id: string, name: string, avatar: string};
            return chat
        } catch (error) {
            throw error
        }
    }

    async retrieveAllChats(userId: string): Promise<IChat[]> {
        try {
            const chats = await this.friendChatRepository.retrieveAllChats(userId);
            return chats
        } catch (error) {
            throw error
        }
    }

    async retrieveChat(userId: string, friendId: string): Promise<IChat | void> {
        try {
            const chat = await this.friendChatRepository.retrieveChat(userId, friendId);            
            return chat
        } catch (error) {
            throw error
        }

   }
  async sendMessage(messageData:IMessage): Promise<void> {
       try {
        await this.friendChatRepository.sendMessage(messageData);
       } catch (error) {
        throw error
       }
   }
   
}