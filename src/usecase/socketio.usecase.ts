import { Socket, Server } from 'socket.io';
import { socketioRepository } from '../infrastructure/repository/socketio.repository';
import { ISocketioUsecase } from '../interface/Iusecase/Isocketio.usecase';
import { IMessage } from '../domain/entities/chat.entities';

export interface userData {
  userId: string;
  username: string;
  avatar: string;
  socketId: string;
}

export default class socketioUseCase implements ISocketioUsecase {
  constructor(private RoomSocketioRepository: socketioRepository, private io: Server) {}

  async handleUserData(socket: Socket, userData: { userId: string; username: string; avatar: string }): Promise<void> {
    await this.RoomSocketioRepository.saveUser(socket.id, userData);
  }

  async handleJoinRoom(socket: Socket, roomID: string): Promise<void> {
    const user: userData | undefined = await this.RoomSocketioRepository.getUser(socket.id);
    if (user) {
      const room: userData[] | undefined = await this.RoomSocketioRepository.getRoomUsers(roomID);
      if (room) {
        const existingUser = room.find((u) => u.userId === user.userId);
        if (existingUser) {
          await this.RoomSocketioRepository.removeUserFromRoom(existingUser.socketId, roomID);
          // await this.handleRoomLeaveCountUpdated(socket, roomID, user.userId);
        }
      }
      await this.RoomSocketioRepository.addUserToRoom(socket, roomID);
      await this.RoomSocketioRepository.updateJoinedCount(roomID);
    } else {
      console.error(`User with socket ID ${socket.id} not found.`);
      await this.RoomSocketioRepository.addUserToRoom(socket, roomID);
    }
  }

  async handleChatMessage(socket: Socket, message: string, roomID: string): Promise<void> {
    const user = await this.RoomSocketioRepository.getUser(socket.id);
    if (user) {
      const formattedMessage = `${user.username}: ${message}`;
      await this.RoomSocketioRepository.sendMessageToRoom(socket, roomID, formattedMessage);
    }
  }

  async handleSendingSignal(socket: Socket, payload: { userToSignal: string; signal: string; callerID: string }): Promise<void> {
    await this.RoomSocketioRepository.sendSignalToUser(socket, payload);
  }

  async handleReturningSignal(socket: Socket, payload: { signal: string; callerID: string }): Promise<void> {
    await this.RoomSocketioRepository.returnSignalToCaller(socket, payload);
  }

  async updateAudioStatus(socket: Socket, roomID: string): Promise<void> {
    await this.RoomSocketioRepository.updateAudioStatus(socket, roomID);
  }

  async updateVideoStatus(socket: Socket, roomID: string): Promise<void> {
    await this.RoomSocketioRepository.updateVideoStatus(socket, roomID);
  }

  async handleDisconnect(socket: Socket): Promise<void> {
    await this.RoomSocketioRepository.removeUser(socket.id);
  }

  async handleLeaveRoom(socket: Socket, roomID: string, userId: string): Promise<void> {
    await this.RoomSocketioRepository.removeUserFromRoom(socket.id, roomID);
    await this.handleRoomLeaveCountUpdated(socket, roomID, userId);
    await this.RoomSocketioRepository.updateJoinedCount(roomID);
    await this.RoomSocketioRepository.scheduleRoomDeletionIfEmpty(roomID);
  }

  async handleJoinPrivateChat(socket: Socket, chatId: string): Promise<void> {
    const user = this.io.sockets.adapter.rooms.get(chatId);
      if(user?.size === 2){
        return;
      }
      socket.join(chatId);
      socket.to(chatId).emit('friend online',"online");
  }

  async handlePrivateChatMessage(socket: Socket, message: IMessage): Promise<void> {
    socket.to(message.chatId).emit('private chat message', message);
  }

  async handleLeavePrivateChat(socket: Socket, chatId: string, lastTime: string): Promise<void> {
    socket.leave(chatId);
    socket.to(chatId).emit('friend offline', lastTime);
  }

  async handleRoomCreated(socket: Socket, roomData: any): Promise<void> {
    socket.broadcast.emit('room-created', roomData);
  }

  async handleRoomCountUpdated(socket: Socket, roomId: string, participantId: string): Promise<void> {
    socket.broadcast.emit('room-count-updated', { roomId, participantId, count: 1 });
  }

  async handleRoomLeaveCountUpdated(socket: Socket, roomId: string, participantId: string): Promise<void> {
    socket.broadcast.emit('room-count-updated', { roomId, participantId, count: -1 });
  }

  async handleGetAllRoomsInfo(socket: Socket): Promise<void> {
    const roomsInfo = await this.RoomSocketioRepository.getAllRoomsInfo();
    socket.emit('rooms info', roomsInfo);
  }

  async handleAddRoom(socket: Socket, roomData: any): Promise<void> {
    try {
      await this.RoomSocketioRepository.addRoom(roomData);
    } catch (error) {
      console.error('Error adding room:', error);
    }
  }
}
