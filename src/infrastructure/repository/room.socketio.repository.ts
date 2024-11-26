// src/infrastructure/repository/room.socketio.repository.ts
import { Socket } from 'socket.io';
import { IroomSocketioRepository } from '../../interface/Irepositories/Iroom.socketio.repository';
import { IChat } from '../../domain/entities/chat.entities';
import { PrismaClient } from '@prisma/client';
export class RoomSocketioRepository implements IroomSocketioRepository {
  private prisma : PrismaClient
  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }
  private users: { [key: string]: { userId: string, username: string, avatar: string, socketId: string } } = {};
  private rooms: { [key: string]: Set<string> } = {}; // Tracks rooms and their connected socket IDs

  saveUser(socketId: string, userData: { userId: string, username: string, avatar: string }): void {
    console.log('User connected:', userData);
    this.users[socketId] = { ...userData, socketId };
  }

  getUser(socketId: string): { userId: string, username: string, avatar: string, socketId: string } | undefined {
    return this.users[socketId];
  }

  addUserToRoom(socket: Socket, roomID: string): void {
    socket.join(roomID);
    if (!this.rooms[roomID]) {
      this.rooms[roomID] = new Set();
    }
    this.rooms[roomID].add(socket.id);
    // const otherUsers = Array.from(this.io.sockets.adapter.rooms.get(roomID) || [])
    //       .filter(id => id !== socket.id)
    //       .map(id => ({
    //         ...this.users[id]
    //       }));
    // socket.emit('all users', otherUsers, roomID);
  }

  sendMessageToRoom(socket: Socket, roomID: string, message: string): void {
    socket.to(roomID).emit('new chat message', message);
  }

  sendSignalToUser(socket: Socket, payload: { userToSignal: string, signal: string, callerID: string }): void {
    socket.to(payload.userToSignal).emit('user joined', payload.signal, this.users[payload.callerID]);
  }

  returnSignalToCaller(socket: Socket, payload: { signal: string, callerID: string }): void {
    socket.to(payload.callerID).emit('receiving returned signal', payload);
  }

  updateAudioStatus(socket: Socket, roomID: string): void {
    socket.to(roomID).emit('audio status updated', socket.id);
  }

  updateVideoStatus(socket: Socket, roomID: string): void {
    socket.to(roomID).emit('video status updated', socket.id);
  }

  removeUser(socketId: string): void {
    delete this.users[socketId];
  }

  removeUserFromRoom(socket: Socket, roomID: string): void {
    socket.leave(roomID);
    this.rooms[roomID]?.delete(socket.id);
    if (this.rooms[roomID]?.size === 0) {
      delete this.rooms[roomID];
    }
  }
  // getUserAllChats(userId: string): Promise<IChat[]> {
  //   try {
     
  //   } catch (error) {
  //     throw error
  //   }
  // }

  // async createNewChat(userId: string, friendId: string): Promise<IChat> {  
  //   try {
  //     const newChat = await this.prisma.chat.create({
  //       data:{userId:userId,friendId:friendId},include:{messages:true}
  //     })
  //     return newChat
  //   } catch (error) {
  //     throw error
  //   }
  // }
}
