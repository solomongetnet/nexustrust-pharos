import { AppSocket, IOServer } from "../types.js";
import { socketState } from "../state-manager.js";

export const registerRoomHandlers = (io: IOServer, socket: AppSocket) => {
  socket.on("room:join", (roomName) => {
    socket.join(roomName);
    socketState.joinRoom(socket.id, roomName);

    socket.to(roomName).emit("notification:received", {
      message: `A new user joined the room ${roomName}`,
      type: "info",
    });
  });

  socket.on("room:leave", (roomName) => {
    socket.leave(roomName);
    socketState.leaveRoom(socket.id, roomName);
  });
};
