import { IOServer, AppSocket } from "./types.js";
import { socketState } from "./state-manager.js";
import { registerChatHandlers } from "./handlers/chat.handler.js";
import { registerRoomHandlers } from "./handlers/room.handler.js";

/**
 * Functional Socket setup
 * Sets up middleware and connection handlers for the provided IO instance
 */
export const setupSocketListeners = (io: IOServer) => {
  // Middleware
  io.use((socket, next) => {
    // Check incoming auth from handshake
    const role = socket.handshake.auth?.role || "USER";
    const name = socket.handshake.auth?.name || `User_${socket.id.substring(0, 4)}`;

    socket.data.user = {
      id: socket.id,
      name: name,
      role: role,
    };
    next();
  });

  // Connection Handler
  io.on("connection", (socket: AppSocket) => {
    const user = socket.data.user;
    const userRole = socket.handshake.auth?.role || "USER";

    if (user) {
      socketState.addUser(socket.id, user);

      // If user is ADMIN, join them to admins room
      if (userRole === "ADMIN") {
        socket.join("admins");
        socketState.joinRoom(socket.id, "admins");
      }
    }

    // Register modular functional handlers
    registerChatHandlers(io, socket);
    registerRoomHandlers(io, socket);

    socket.on("disconnect", (reason) => {
      const user = socketState.getUser(socket.id);
      socketState.removeUser(socket.id);
      console.log(`🔌 [Socket] Disconnected: ${user?.name || socket.id} (${reason})`);
    });
  });
};
