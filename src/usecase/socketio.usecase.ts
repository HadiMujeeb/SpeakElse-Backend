// src/usecase/socket.usecase.ts
import { Socket } from 'socket.io';
import { SocketioRepository } from '../infrastructure/repository/socketio.repository';
import { ISocketioUsecase } from '../interface/Iusecase/Isocketio.usecase';

export interface userData {
  userId: string;
  username: string;
  avatar: string;
  socketId: string;
}

export class socketioUseCase implements ISocketioUsecase {
  constructor(private RoomSocketioRepository: SocketioRepository) {}

  // Save user data
  async handleUserData(socket: Socket, userData: { userId: string; username: string; avatar: string }): Promise<void> {
    await this.RoomSocketioRepository.saveUser(socket.id, userData);
  }

  // Handle user joining a room
  async handleJoinRoom(socket: Socket, roomID: string): Promise<void> {
    const user: userData | undefined = await this.RoomSocketioRepository.getUser(socket.id);
    console.log('User data:', user);

    if (user) {
      const room: userData[] | undefined = await this.RoomSocketioRepository.getRoomUsers(roomID);
      console.log('Room users:', room);
      if (room) {
        const existingUser = room.find((u) => u.userId === user.userId);
        console.log('Existing user:', existingUser);

        if (existingUser) {
          console.log(`User ${user.userId} is already in room ${roomID}. Removing and re-adding.`);
          await this.RoomSocketioRepository.removeUserFromRoom(existingUser.socketId, roomID);
        }
      }

      await this.RoomSocketioRepository.addUserToRoom(socket, roomID);
    } else {
      console.error(`User with socket ID ${socket.id} not found.`);
      await this.RoomSocketioRepository.addUserToRoom(socket, roomID);
    }
  }

  // Handle sending a chat message
  async handleChatMessage(socket: Socket, message: string, roomID: string): Promise<void> {
    const user = await this.RoomSocketioRepository.getUser(socket.id);
    if (user) {
      const formattedMessage = `${user.username}: ${message}`;
      await this.RoomSocketioRepository.sendMessageToRoom(socket, roomID, formattedMessage);
    }
  }

  // Handle sending a WebRTC signal
  async handleSendingSignal(
    socket: Socket,
    payload: { userToSignal: string; signal: string; callerID: string }
  ): Promise<void> {
    await this.RoomSocketioRepository.sendSignalToUser(socket, payload);
  }

  // Handle returning a WebRTC signal
  async handleReturningSignal(socket: Socket, payload: { signal: string; callerID: string }): Promise<void> {
    await this.RoomSocketioRepository.returnSignalToCaller(socket, payload);
  }

  // Update audio status for a room
  async updateAudioStatus(socket: Socket, roomID: string): Promise<void> {
    await this.RoomSocketioRepository.updateAudioStatus(socket, roomID);
  }

  // Update video status for a room
  async updateVideoStatus(socket: Socket, roomID: string): Promise<void> {
    await this.RoomSocketioRepository.updateVideoStatus(socket, roomID);
  }

  // Handle user disconnect
  async handleDisconnect(socket: Socket): Promise<void> {
    await this.RoomSocketioRepository.removeUser(socket.id);
  }

  // Handle user leaving a room
  async handleLeaveRoom(socket: Socket, roomID: string): Promise<void> {
    await this.RoomSocketioRepository.removeUserFromRoom(socket.id, roomID);
  }
}
