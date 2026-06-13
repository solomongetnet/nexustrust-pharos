import { AppSocket, IOServer } from "../types.js";
import { socketState } from "../state-manager.js";

export const registerChatHandlers = (io: IOServer, socket: AppSocket) => {
  socket.on("chat:send", (payload) => {
    const user = socketState.getUser(socket.id);

    if (!user) {
      socket.emit("system:error", { message: "Unauthorized chat attempt" });
      return;
    }

    io.emit("chat:message", {
      from: user.name,
      message: payload.message,
      timestamp: Date.now(),
    });
  });
};
