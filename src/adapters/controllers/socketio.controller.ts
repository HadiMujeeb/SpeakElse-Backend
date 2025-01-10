import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import { PrismaClient } from '@prisma/client';
import { SocketioRepository } from '../../infrastructure/repository/socketio.repository';
import { socketioUseCase } from '../../usecase/socketio.usecase';

export class SocketioController {
  private io: Server;
  private prisma: PrismaClient;

  constructor(private httpServer: HttpServer) {
    this.prisma = new PrismaClient(); // Initialize PrismaClient
    this.io = new Server(httpServer, {
      cors: {
        origin: process.env.FRONTEND_URL,
        credentials: true,
      },
    });

    const roomSocketioRepository = new SocketioRepository(this.io, this.prisma); // Pass prisma instance
    const roomSocketioUseCase = new socketioUseCase(roomSocketioRepository);

    this.initializeSocketEvents(roomSocketioUseCase);
  }

  private initializeSocketEvents(roomSocketioUseCase: socketioUseCase): void {
    this.io.on('connection', (socket) => {
      console.log('A user connected', socket.id);

      socket.on('set user data', (userData) => roomSocketioUseCase.handleUserData(socket, userData));
      socket.on('join room', (roomID) => roomSocketioUseCase.handleJoinRoom(socket, roomID));
      socket.on('chat message', (message, roomID) => roomSocketioUseCase.handleChatMessage(socket, message, roomID));
      socket.on('sending signal', (payload) => roomSocketioUseCase.handleSendingSignal(socket, payload));
      socket.on('returning signal', (payload) => roomSocketioUseCase.handleReturningSignal(socket, payload));
      socket.on('update audio status', (roomID) => roomSocketioUseCase.updateAudioStatus(socket, roomID));
      socket.on('update video status', (roomID) => roomSocketioUseCase.updateVideoStatus(socket, roomID));
      socket.on('disconnect', () => roomSocketioUseCase.handleDisconnect(socket));
      socket.on('leave room', (roomID) => roomSocketioUseCase.handleLeaveRoom(socket, roomID));
    });
  }
}
