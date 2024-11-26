import { IChat, IMessage } from "../domain/entities/chat.entities";
import { IFriendChatUsecase } from "../interface/Iusecase/IfriendChat.usecase";
import FriendChatRepository from "../infrastructure/repository/friendChat.repository";
export default class FriendChatUseCase implements IFriendChatUsecase {
    private FriendChatRepository: FriendChatRepository
    constructor(FriendChatRepository: FriendChatRepository) {
        this.FriendChatRepository = FriendChatRepository
    }
   async createChat(userId: string, friendId: string): Promise<IChat> {
        try {
            const chat = await this.FriendChatRepository.createChat(userId, friendId);
            const user= await this.FriendChatRepository.findUserById(friendId);
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
            const chats = await this.FriendChatRepository.retrieveAllChats(userId);
            return chats
        } catch (error) {
            throw error
        }
    }

    async retrieveChat(userId: string, friendId: string): Promise<IChat | void> {
        try {
            const chat = await this.FriendChatRepository.retrieveChat(userId, friendId);            
            return chat
        } catch (error) {
            throw error
        }

   }
  async sendMessage(messageData:IMessage): Promise<void> {
       try {
        await this.FriendChatRepository.sendMessage(messageData);
       } catch (error) {
        throw error
       }
   }
   
}