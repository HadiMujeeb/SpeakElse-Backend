import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import { IMessage } from '../entities/chat.entities';

export class SocketService {
  private io: Server;
  private users: { [key: string]: { userId: string, username: string, avatar: string ,socketId: string} } = {}; 

  constructor(httpServer: HttpServer) {
    this.io = new Server(httpServer, {
      cors: {
        origin: process.env.FRONTEND_URL,
        credentials: true
      }
    });
    this.initializeSocketEvents();
  }

  private initializeSocketEvents(): void {

    this.io.on('connection', (socket) => {
      console.log('A user connected', socket.id);
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
        this.sendRoomInfoToAllUsers(roomID);
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
        this.sendRoomInfoToAllUsers(roomID);
      });
   

    socket.on('join private chat',(chatId:string)=>{
      const user = this.io.sockets.adapter.rooms.get(chatId);
      if(user?.size === 2){
        return;
      }
      socket.join(chatId);
      socket.to(chatId).emit('friend online',"online");
    })

    socket.on('private chat message', (message:IMessage) => {
      socket.to(message.chatId).emit('private chat message', message);
    });

    socket.on('leave private chat', (chatId: string,lastTime:string) => {
      socket.leave(chatId);
      socket.to(chatId).emit('friend offline',lastTime);
    });

    socket.on('room-created', (roomData) => {
      console.log('Room created:', roomData);
      socket.broadcast.emit('room-created', roomData); // broadcast to all others
    });

    socket.on('update-room-count', ({ roomId, participantId }) => {
      socket.broadcast.emit('room-count-updated', { roomId, participantId });
      console.log(`Broadcasted room update: roomId=${roomId}, new participant=${participantId}`);
    });

    socket.on('get all rooms info', () => {
      const roomsInfo: {
        roomId: string;
        memberCount: number;
        members: string[]; // Array of userIds
      }[] = [];
    
      const rooms = this.io.sockets.adapter.rooms;
      const sids = this.io.sockets.adapter.sids;
    
      for (const [roomId, sockets] of rooms.entries()) {
        // Skip individual socket rooms
        if (sids.get(roomId)) continue;
    
        const members = Array.from(sockets)
          .map((socketId) => this.users[socketId]?.userId)
          .filter((userId): userId is string => Boolean(userId)); // filter out undefined
    
        roomsInfo.push({
          roomId,
          memberCount: members.length,
          members,
        });
      }
    
      socket.emit('rooms info', roomsInfo);
    });
    });
  }

  private sendRoomInfoToAllUsers(roomID: string): void {
    const room = this.io.sockets.adapter.rooms.get(roomID);
    const members = Array.from(room || [])
      .map((socketId) => this.users[socketId]?.userId)
      .filter((userId): userId is string => Boolean(userId));

    const memberCount = members.length;
    
    // Emit the updated room info to all users in the room
    this.io.emit('rooms info', {
      roomId: roomID,
      memberCount,
      members,
    });
  }

}
