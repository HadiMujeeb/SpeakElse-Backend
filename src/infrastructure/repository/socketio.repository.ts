import { Server, Socket } from 'socket.io';
import { PrismaClient } from '@prisma/client';
import { ISocketioRepository } from '../../interface/Irepositories/Isocketio.repository';
import { IUserCreatedRoom } from '../../domain/entities/room.entities';

export class socketioRepository implements ISocketioRepository {
  private users: { [key: string]: { userId: string, username: string, avatar: string, socketId: string } } = {};
  private rooms: { [key: string]: Set<string> } = {};
  private roomsData: IUserCreatedRoom[] = [];
  private prisma: PrismaClient;
  private io: Server;

  constructor(io: Server, prisma: PrismaClient) {
    this.io = io;
    this.prisma = prisma;
  }

  async addRoom(room: IUserCreatedRoom) {
    try {
      this.roomsData.push(room);
      this.scheduleRoomDeletionIfEmpty(room.id);
    } catch (error) {
      throw error;
    }
    console.log('Room metadata stored:', room);
  }

  getRoomData(roomID: string): IUserCreatedRoom | undefined {
    return this.roomsData.find((r) => r.id === roomID);
  }

  scheduleRoomDeletionIfEmpty(roomID: string): void {
    setTimeout(async () => {
      const room = this.roomsData.find((r) => r.id === roomID);
      if (!room || room.peopleCount.joined === 0) {
        this.roomsData = this.roomsData.filter((r) => r.id !== roomID);
        console.log(`Room ${roomID} deleted after 5 minutes due to inactivity.`);
        try {
          await this.deleteRoom(roomID);
        } catch (error) {
          console.error(`Error deleting room ${roomID} from DB:`, error);
        }
      } else {
        console.log(`Room ${roomID} still has ${room.peopleCount.joined} users. Not deleting.`);
      }
    }, 5 * 60 * 1000);
  }

  async deleteRoom(roomId: string): Promise<void> {
    try {
      await this.prisma.room.delete({ where: { id: roomId } });
      this.io.emit('room deleted', roomId);
      console.log(`Room ${roomId} deleted from the database.`);
    } catch (error) { 
      console.error(`Failed to delete room ${roomId}:`, error);
      throw error;
    }
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
    return roomUsers.map((id) => this.users[id]);
  }

  addUserToRoom(socket: Socket, roomID: string): void {
    socket.join(roomID);
    const otherUsers = Array.from(this.io.sockets.adapter.rooms.get(roomID) || [])
      .filter((id) => id !== socket.id)
      .map((id) => ({ ...this.users[id] }));
    socket.emit('all users', otherUsers, roomID);
  }

  async updateJoinedCount(roomId: string): Promise<void> {
    const room = this.roomsData.find((r) => r.id === roomId);
    if (room) {
      room.peopleCount.joined += 1;
      console.log(`Updated joined count for room ${roomId}:`, room.peopleCount.joined);
    } else {
      console.warn(`Room with ID ${roomId} not found in memory.`);
    }
  }

  async updateLeaveCount(roomId: string): Promise<void> {
    const room = this.roomsData.find((r) => r.id === roomId);
    if (room) {
      room.peopleCount.joined -= 1;
      console.log(`Updated joined count for room ${roomId}:`, room.peopleCount.joined);
    } else {
      console.warn(`Room with ID ${roomId} not found in memory.`);
    }
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
      userDetails: this.users[socket.id]
    });
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
      socket.leave(roomID);
      console.log(`User with socket ID ${socketId} left room ${roomID}`);
    }
  }

  private getSocket(socketId: string): Socket | undefined {
    const connectedSockets = this.io.sockets.sockets;
    return connectedSockets.get(socketId);
  }

  getAllRoomsInfo(): any[] {
    const roomsInfo = [];
    for (const [roomId, room] of this.io.sockets.adapter.rooms.entries()) {
      const members = Array.from(room).map((socketId) => this.users[socketId]?.userId);
      roomsInfo.push({ roomId, memberCount: members.length, members });
    }
    return roomsInfo;
  }
}
