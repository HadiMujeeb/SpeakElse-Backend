export interface IChat {
    id: string;
    messages?: IMessage[];
    createdAt: Date;
    updatedAt: Date;
    friend?:{
      id: string,
      name: string,
      avatar: string,
    }
  }
  
  export interface IMessage {
    id: string;
    chatId: string;
    senderId: string;
    content: string;
    createdAt: Date;
  }
  