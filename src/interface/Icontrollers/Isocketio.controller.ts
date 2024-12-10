import { Socket } from 'socket.io';
export interface IUserData {
    userId: string;
    username: string;
    avatar: string;
  }

export interface IRoomSocketioController {
  handleUserData(socket: Socket, userData: IUserData): void; 
  handleChatMessage(socket: Socket, message: string, roomID: string): void;
  handleSendingSignal(socket: Socket, payload: { userToSignal: string, signal: string, callerID: string }): void;
  handleReturningSignal(socket: Socket, payload: { signal: string, callerID: string }): void;
  updateAudioStatus(socket: Socket, roomID: string): void;
  updateVideoStatus(socket: Socket, roomID: string): void;
  handleDisconnect(socket: Socket): void;
  handleLeaveRoom(socket: Socket, roomID: string): void;
}