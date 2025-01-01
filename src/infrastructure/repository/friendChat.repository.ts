import { PrismaClient } from "@prisma/client";
import { IFriendChatRepository } from "../../interface/Irepositories/IfriendChat.repository";
import { IChat, IMessage } from "../../domain/entities/chat.entities";
import { IUser } from "../../domain/entities/user.entities";


export default class FriendChatRepository implements IFriendChatRepository {
 private prisma: PrismaClient
 constructor(prisma: PrismaClient) {
     this.prisma = prisma
     
 }

 async findUserById(id: string): Promise<IUser | null> {
     try {
        const user = await this.prisma.user.findUnique({
        where:{id}
        })
        return user
     } catch (error) {
        throw error
     }
 }

 async createChat(userId: string, friendId: string): Promise<IChat> {
    try {
      // Create the chat with the user and friend
      const chat = await this.prisma.chat.create({
        data: { participaceId: [userId, friendId] },
        include: { messages: true },
      });

      return chat;
    } catch (error) {
      throw error;
    }
  }
  

 async retrieveAllChats(userId: string): Promise<IChat[]> {
    try {
      // Retrieve all chats where the user is a participant
      const chats = await this.prisma.chat.findMany({
        where: { participaceId: { has: userId } },
        include: { messages: true },
      });
  
      // Map through the chats to enrich with friend details
      const enrichedChats: IChat[] = await Promise.all(
        chats.map(async (chat: any) => {
          // Get the friend's ID by excluding the current user's ID
          const friendId = chat.participaceId.find((id:any) => id !== userId);
  
          // Fetch friend's details
          const friend = friendId ? await this.findUserById(friendId) : null;
  
          // Return the chat enriched with the friend's details
          return {
            id: chat.id,
            messages: chat.messages,
            createdAt: chat.createdAt,
            updatedAt: chat.updatedAt,
            friend: friend
              ? { id: friend.id, name: friend.name, avatar: friend.avatar || '' }
              : undefined,
          };
        })
      );
  
      return enrichedChats;
    } catch (error) {
      throw error;
    }
  }
  
 async retrieveChat(userId: string, friendId: string): Promise<IChat | void> {
     try {
        const chat = await this.prisma.chat.findFirst({
            where:{participaceId:{hasEvery:[userId,friendId]}},include:{messages:true}
        })
     } catch (error) {
        throw error
     }
 }
 async retrieveChatById(chatId: string): Promise<IChat | void> {
     try {
        
     } catch (error) {
        throw error
     }
 }

 async sendMessage(data:IMessage): Promise<void> {
     try {
       await this.prisma.message.create({
            data:{
                chatId:data.chatId,
                senderId:data.senderId,
                content:data.content,
                createdAt:data.createdAt
            }
        })
     } catch (error) {
        throw error
     }
 }
}