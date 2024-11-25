export interface IChat {
    id: string;
    userId: string;
    friendId: string;
    messages: IMessage[]|null;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface IMessage {
    id: string;
    chatId: string;
    senderId: string;
    content: string;
    createdAt: Date;
  }
  