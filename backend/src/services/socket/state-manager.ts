import { User } from "./types.js";

/**
 * Centralized State Manager for Socket Service
 * Handles connected users, rooms, and other realtime states in a thread-safe singleton.
 */
export class SocketStateManager {
  private static instance: SocketStateManager;
  
  // Maps socketId to User object
  private connectedUsers: Map<string, User> = new Map();
  
  // Maps roomId to Set of socketIds
  private activeRooms: Map<string, Set<string>> = new Map();

  private constructor() {}

  public static getInstance(): SocketStateManager {
    if (!SocketStateManager.instance) {
      SocketStateManager.instance = new SocketStateManager();
    }
    return SocketStateManager.instance;
  }

  // --- User Management ---
  public addUser(socketId: string, user: User): void {
    this.connectedUsers.set(socketId, user);
  }

  public removeUser(socketId: string): void {
    this.connectedUsers.delete(socketId);
    // Also cleanup rooms
    this.activeRooms.forEach((sockets, room) => {
      sockets.delete(socketId);
      if (sockets.size === 0) {
        this.activeRooms.delete(room);
      }
    });
  }

  public getUser(socketId: string): User | undefined {
    return this.connectedUsers.get(socketId);
  }

  public getAllConnectedUsers(): User[] {
    return Array.from(this.connectedUsers.values());
  }

  // --- Room Management ---
  public joinRoom(socketId: string, roomName: string): void {
    if (!this.activeRooms.has(roomName)) {
      this.activeRooms.set(roomName, new Set());
    }
    this.activeRooms.get(roomName)?.add(socketId);
  }

  public leaveRoom(socketId: string, roomName: string): void {
    this.activeRooms.get(roomName)?.delete(socketId);
    if (this.activeRooms.get(roomName)?.size === 0) {
      this.activeRooms.delete(roomName);
    }
  }

  public getRoomSockets(roomName: string): string[] {
    return Array.from(this.activeRooms.get(roomName) || []);
  }

  public getAllRooms(): string[] {
    return Array.from(this.activeRooms.keys());
  }
}

export const socketState = SocketStateManager.getInstance();
