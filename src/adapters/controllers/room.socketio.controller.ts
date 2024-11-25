// src/infrastructure/gateway/socket.gateway.ts
import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import { roomSocketioUseCase } from '../../usecase/room.socketio.usecase';

export class RoomSocketioController {
  private io: Server;

  constructor(private httpServer: HttpServer, private roomSocketioUseCase: roomSocketioUseCase) {
    this.io = new Server(httpServer, {
      cors: {
        origin: 'http://localhost:4200',
        credentials: true,
      }
    });
    this.initializeSocketEvents();
  }

  private initializeSocketEvents(): void {
    this.io.on('connection', (socket) => {
      console.log('A user connected', socket.id);

      socket.on('set user data', (userData) => this.roomSocketioUseCase.handleUserData(socket, userData));
      socket.on('join room', (roomID) => this.roomSocketioUseCase.handleJoinRoom(socket, roomID));
      socket.on('chat message', (message, roomID) => this.roomSocketioUseCase.handleChatMessage(socket, message, roomID));
      socket.on('sending signal', (payload) => this.roomSocketioUseCase.handleSendingSignal(socket, payload));
      socket.on('returning signal', (payload) => this.roomSocketioUseCase.handleReturningSignal(socket, payload));
      socket.on('update audio status', (roomID) => this.roomSocketioUseCase.updateAudioStatus(socket, roomID));
      socket.on('update video status', (roomID) => this.roomSocketioUseCase.updateVideoStatus(socket, roomID));
      socket.on('disconnect', () => this.roomSocketioUseCase.handleDisconnect(socket));
      socket.on('leave room', (roomID) => this.roomSocketioUseCase.handleLeaveRoom(socket, roomID));
    });
  }
}
