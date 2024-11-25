import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';

export class SocketService {
  private io: Server;
  private users: { [key: string]: { userId: string, username: string, avatar: string ,socketId: string} } = {};

  constructor(httpServer: HttpServer) {
    this.io = new Server(httpServer, {
      cors: {
        origin: 'http://localhost:4200',
        credentials: true
      }
    });
    this.initializeSocketEvents();
  }

  private initializeSocketEvents(): void {
    this.io.on('connection', (socket) => {
      socket.on('set user data', (userData: { userId: string, username: string, avatar: string, }) => {
        this.users[socket.id] = { ...userData, socketId: socket.id };
        // socket.emit('user data attached', this.users[socket.id]);
      });

      socket.on('join room', (roomID: string) => {
        socket.join(roomID);
        const otherUsers = Array.from(this.io.sockets.adapter.rooms.get(roomID) || [])
          .filter(id => id !== socket.id)
          .map(id => ({
            ...this.users[id]
          }));
          console.log("other users",otherUsers);
        socket.emit('all users', otherUsers, roomID);
        // socket.to(roomID).emit('user joined',  this.users[socket.id] );
      });

      socket.on('chat message', (message: string, roomID: string) => {
        const user = this.users[socket.id];
        if (user) {
          const formattedMessage = `${user.username}: ${message}`;
          socket.to(roomID).emit('new chat message', formattedMessage);
        }
      });

      socket.on('sending signal', (payload: { userToSignal: string, signal: string, callerID: string }) => {
        this.io.to(payload.userToSignal).emit('user joined',
        payload.signal,
        this.users[payload.callerID]
        );
      });

      socket.on('returning signal', (payload: { signal: string, callerID: string }) => {
        this.io.to(payload.callerID).emit('receiving returned signal', {
          signal: payload.signal,
          id: socket.id,
          userDetails: this.users[socket.id]
        });
      });

      socket.on('update audio status', (roomID: string) => {

        socket.to(roomID).emit('audio status updated', 
         socket.id,
        );
      });
      
      socket.on('update video status', (roomID: string) => {
        socket.to(roomID).emit('video status updated', 
         socket.id,
        );
      });

      socket.on('disconnect', () => {
        delete this.users[socket.id];
        this.io.emit('user-left', socket.id);
      });

      socket.on('leave room', (roomID: string) => {
        socket.leave(roomID);
        socket.to(roomID).emit('user left', { userId: socket.id });
      });
    });
  }
}
