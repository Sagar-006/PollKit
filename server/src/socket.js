import { Server } from "socket.io";
let io;

const initSocket = (server) => {
  
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("socket connected:", socket.id);

    // creator joins poll room
    socket.on("join-poll", (pollId) => {
      socket.join(pollId);
      console.log(`socket ${socket.id} joined poll room: ${pollId}`);
    });

    socket.on("disconnect", () => {
      console.log("socket disconnected:", socket.id);
    });
  });
};

const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized!");
  return io;
};

export { initSocket, getIO };