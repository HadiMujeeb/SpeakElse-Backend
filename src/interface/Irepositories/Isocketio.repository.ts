
import { Socket } from 'socket.io';
import { IChat } from '../../domain/entities/chat.entities';

export interface ISocketioRepository {
  saveUser(socketId: string, userData: { userId: string, username: string, avatar: string }): void;
  getUser(socketId: string): { userId: string, username: string, avatar: string, socketId: string } | undefined;
  addUserToRoom(socket: Socket, roomID: string): void;
  sendMessageToRoom(socket: Socket, roomID: string, message: string): void;
  sendSignalToUser(socket: Socket, payload: { userToSignal: string, signal: string, callerID: string }): void;
  returnSignalToCaller(socket: Socket, payload: { signal: string, callerID: string }): void;
  updateAudioStatus(socket: Socket, roomID: string): void;
  updateVideoStatus(socket: Socket, roomID: string): void;
  removeUser(socketId: string): void;
  removeUserFromRoom(socketId: string, roomID: string): void;

  // getAllUserChats(userId:string):Promise<IChat[]>
  // createNewChat(userId: string, friendId: string):Promise<IChat>

}
