import { Server } from "socket.io";

export const connectToServer = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    socket.on("join-call", (path) => {
      if (connection[path] === undefined) {
        connection[path] = [];
      }
      connection[path].push(socket.id);
      for (let i = 0; i < connection[path].length; i++) {
        io.to(
          connection[path][i].emit("user-joined", socket.id, connection[path])
        );
      }
    });

    //signaling stage
    socket.on("signal", (toId, message) => {
      io.to(toId).emit("signal", socket.id, message);
    });

    socket.on("disconnect", () => {
      let roomKey = null;

      for (const [key, users] of Object.entries(connections)) {
        if (users.includes(socket.id)) {
          roomKey = key;
          break;
        }
      }

      if (!roomKey) return;

      for (let i = 0; i < connections[roomKey].length; i++) {
        io.to(connections[roomKey][i]).emit("user-left", socket.id);
      }

      connections[roomKey] = connections[roomKey].filter(
        (id) => id !== socket.id
      );

      if (connections[roomKey].length === 0) {
        delete connections[roomKey];
      }
    });
  });
  return io;
};
