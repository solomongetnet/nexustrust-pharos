import { Server as SocketIOServer, Socket } from "socket.io";

export interface User {
  id: string;
  name: string;
  role: string;
}

export interface ServerToClientEvents {
  "notification:received": (payload: { message: string; type: string }) => void;
  "chat:message": (payload: { from: string; message: string; timestamp: number }) => void;
  "order:updated": (payload: { orderId: string; status: string }) => void;
  "system:error": (payload: { message: string }) => void;
}

export interface ClientToServerEvents {
  "chat:send": (payload: { to: string; message: string }) => void;
  "room:join": (roomName: string) => void;
  "room:leave": (roomName: string) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  user?: User;
}

export type IOServer = SocketIOServer<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

export type AppSocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;
