import { Request, Response, NextFunction } from "express";
import { socketState } from "../services/socket/state-manager.js";
import { io } from "../index.js";

const socketController = {
  /**
   * List all currently connected users
   */
  async getConnectedUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = socketState.getAllConnectedUsers();
      res.json({
        count: users.length,
        users,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * List all active rooms
   */
  async getActiveRooms(req: Request, res: Response, next: NextFunction) {
    try {
      const rooms = socketState.getAllRooms();
      res.json({
        count: rooms.length,
        rooms,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Push a notification to a specific room
   * Primarily for admin usage
   */
  async pushNotificationToRoom(req: Request, res: Response, next: NextFunction) {
    try {
      const { roomName, message, type = "info" } = req.body;

      if (!roomName || !message) {
        res.status(400).json({ error: "roomName and message are required" });
        return;
      }

      // Emit to specific room using the global io instance
      io.to(roomName).emit("notification:received", {
        message,
        type,
      });

      console.log(`📢 [Admin] Pushed notification to room '${roomName}': ${message}`);

      res.json({
        success: true,
        message: `Notification sent to room ${roomName}`,
      });
    } catch (error) {
      next(error);
    }
  },
};

export default socketController;
