import { socketState } from "./state-manager.js";
import { registerChatHandlers } from "./handlers/chat.handler.js";
import { registerRoomHandlers } from "./handlers/room.handler.js";
/**
 * Functional Socket setup
 * Sets up middleware and connection handlers for the provided IO instance
 */
export const setupSocketListeners = (io) => {
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
    io.on("connection", (socket) => {
        const user = socket.data.user;
        if (user) {
            socketState.addUser(socket.id, user);
            console.log(`📡 [Socket] Connected: ${user.name} (${socket.id}) as ${user.role}`);
            // If user is ADMIN, join them to admins room
            if (user.role === "ADMIN") {
                socket.join("admins");
                socketState.joinRoom(socket.id, "admins");
                console.log(`🛡️ [Socket] Admin ${user.name} joined 'admins' room`);
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
