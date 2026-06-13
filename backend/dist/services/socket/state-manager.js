/**
 * Centralized State Manager for Socket Service
 * Handles connected users, rooms, and other realtime states in a thread-safe singleton.
 */
export class SocketStateManager {
    static instance;
    // Maps socketId to User object
    connectedUsers = new Map();
    // Maps roomId to Set of socketIds
    activeRooms = new Map();
    constructor() { }
    static getInstance() {
        if (!SocketStateManager.instance) {
            SocketStateManager.instance = new SocketStateManager();
        }
        return SocketStateManager.instance;
    }
    // --- User Management ---
    addUser(socketId, user) {
        this.connectedUsers.set(socketId, user);
    }
    removeUser(socketId) {
        this.connectedUsers.delete(socketId);
        // Also cleanup rooms
        this.activeRooms.forEach((sockets, room) => {
            sockets.delete(socketId);
            if (sockets.size === 0) {
                this.activeRooms.delete(room);
            }
        });
    }
    getUser(socketId) {
        return this.connectedUsers.get(socketId);
    }
    getAllConnectedUsers() {
        return Array.from(this.connectedUsers.values());
    }
    // --- Room Management ---
    joinRoom(socketId, roomName) {
        if (!this.activeRooms.has(roomName)) {
            this.activeRooms.set(roomName, new Set());
        }
        this.activeRooms.get(roomName)?.add(socketId);
    }
    leaveRoom(socketId, roomName) {
        this.activeRooms.get(roomName)?.delete(socketId);
        if (this.activeRooms.get(roomName)?.size === 0) {
            this.activeRooms.delete(roomName);
        }
    }
    getRoomSockets(roomName) {
        return Array.from(this.activeRooms.get(roomName) || []);
    }
    getAllRooms() {
        return Array.from(this.activeRooms.keys());
    }
}
export const socketState = SocketStateManager.getInstance();
