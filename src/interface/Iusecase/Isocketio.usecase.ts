// src/usecase/socket.usecase.interface.ts
import { Socket } from 'socket.io';

export interface ISocketioUsecase {
  handleUserData(socket: Socket, userData: { userId: string, username: string, avatar: string }): void;
  handleJoinRoom(socket: Socket, roomID: string): void;
  handleChatMessage(socket: Socket, message: string, roomID: string): void;
  handleSendingSignal(socket: Socket, payload: { userToSignal: string, signal: string, callerID: string }): void;
  handleReturningSignal(socket: Socket, payload: { signal: string, callerID: string }): void;
  updateAudioStatus(socket: Socket, roomID: string): void;
  updateVideoStatus(socket: Socket, roomID: string): void;
  handleDisconnect(socket: Socket): void;
  handleLeaveRoom(socket: Socket, roomID: string,userId:string): void;
}
