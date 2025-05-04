import { Server } from 'socket.io';

export const initializeSocketIO = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    socket.on('chat message', (msgData) => {
      io.emit('chat message', msgData);
    });
    
    socket.on('disconnect', () => {
    });
  });

  return io;
};
