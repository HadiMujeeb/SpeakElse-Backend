import { Server, Socket } from 'socket.io';
import { PrismaClient } from '@prisma/client';
import { ISocketioRepository } from '../../interface/Irepositories/Isocketio.repository';

export class SocketioRepository implements ISocketioRepository {
  private users: { [key: string]: { userId: string, username: string, avatar: string, socketId: string } } = {};
  private rooms: { [key: string]: Set<string> } = {};
  private prisma: PrismaClient;
  private io: Server;

  constructor(io: Server, prisma: PrismaClient) {
    this.io = io;
    this.prisma = prisma;
  }

  saveUser(socketId: string, userData: { userId: string, username: string, avatar: string }): void {
    console.log('User connected:', userData);
    this.users[socketId] = { ...userData, socketId };
  }

  getUser(socketId: string): { userId: string, username: string, avatar: string, socketId: string } | undefined {
    return this.users[socketId];
  }
 
  getRoomUsers(roomID: string): { userId: string, username: string, avatar: string, socketId: string }[] | undefined {
    const roomUsers = Array.from(this.io.sockets.adapter.rooms.get(roomID) || []);
    const users = roomUsers.map((id) => this.users[id]);
    return users;
  }

  addUserToRoom(socket: Socket, roomID: string): void {
    socket.join(roomID);

    const otherUsers = Array.from(this.io.sockets.adapter.rooms.get(roomID) || [])
      .filter((id) => id !== socket.id)
      .map((id) => ({
        ...this.users[id],
      }));
    socket.emit('all users', otherUsers, roomID);
  }

  sendMessageToRoom(socket: Socket, roomID: string, message: string): void {
    socket.to(roomID).emit('new chat message', message);
  }

  sendSignalToUser(socket: Socket, payload: { userToSignal: string, signal: string, callerID: string }): void {
    socket.to(payload.userToSignal).emit('user joined', payload.signal, this.users[payload.callerID]);
  }

  returnSignalToCaller(socket: Socket, payload: { signal: string, callerID: string }): void {
    socket.to(payload.callerID).emit('receiving returned signal', {
      signal: payload.signal,
      id: socket.id,
      userDetails: this.users[socket.id]});
  }

  updateAudioStatus(socket: Socket, roomID: string): void {
    socket.to(roomID).emit('audio status updated', socket.id);
  }

  updateVideoStatus(socket: Socket, roomID: string): void {
    socket.to(roomID).emit('video status updated', socket.id);
  }

  removeUser(socketId: string): void {
    delete this.users[socketId];
    console.log('User disconnected:', socketId);
  }

  removeUserFromRoom(socketId: string, roomID: string): void {
    const socket = this.getSocket(socketId); 
    if (socket) {
      socket.emit('you-left', roomID);
      socket.to(roomID).emit('user-left', socketId);
      console.log(`User with socket ID ${socketId} left room ${roomID}`);
        socket.leave(roomID);

    }
    // const room = this.rooms[roomID];
    // if (room) {
    //     room.delete(socketId);
    //     if (room.size === 0) {
    //         delete this.rooms[roomID];
    //     }
    //     console.log(`User with socket ID ${socketId} removed from room ${roomID}`);
    // } else {
    //     console.warn(`Room ${roomID} not found.`);
    // }
}
private getSocket(socketId: string): Socket | undefined {
  const connectedSockets = this.io.sockets.sockets;
  return connectedSockets.get(socketId);
}
}
