// src/usecase/socket.usecase.ts
import { Socket } from 'socket.io';
import { RoomSocketioRepository } from '../infrastructure/repository/room.socketio.repository';
import { IroomScoketioUsecase } from '../interface/Iusecase/Iroom.socketio.usecase';

export class roomSocketioUseCase implements IroomScoketioUsecase {
  constructor(private RoomSocketioRepository: RoomSocketioRepository) {}

  handleUserData(socket: Socket, userData: { userId: string, username: string, avatar: string }): void {
    this.RoomSocketioRepository.saveUser(socket.id, userData);
  }

  handleJoinRoom(socket: Socket, roomID: string): void {
    this.RoomSocketioRepository.addUserToRoom(socket, roomID);
  }

  handleChatMessage(socket: Socket, message: string, roomID: string): void {
    const user = this.RoomSocketioRepository.getUser(socket.id);
    if (user) {
      const formattedMessage = `${user.username}: ${message}`;
      this.RoomSocketioRepository.sendMessageToRoom(socket,roomID, formattedMessage);
    }
  }

  handleSendingSignal(socket: Socket, payload: { userToSignal: string, signal: string, callerID: string }): void {
    this.RoomSocketioRepository.sendSignalToUser(socket,payload);
  }

  handleReturningSignal(socket: Socket, payload: { signal: string, callerID: string }): void {
    this.RoomSocketioRepository.returnSignalToCaller(socket,payload);
  }

  updateAudioStatus(socket: Socket, roomID: string): void {
    this.RoomSocketioRepository.updateAudioStatus(socket, roomID);
  }

  updateVideoStatus(socket: Socket, roomID: string): void {
    this.RoomSocketioRepository.updateVideoStatus(socket, roomID);
  }

  handleDisconnect(socket: Socket): void {
    this.RoomSocketioRepository.removeUser(socket.id);
  }

  handleLeaveRoom(socket: Socket, roomID: string): void {
    this.RoomSocketioRepository.removeUserFromRoom(socket, roomID);
  }
}
