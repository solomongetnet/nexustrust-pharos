import { Router } from "express";
import socketController from "../controllers/socket.controller.js";
const router = Router();
// @/socket
router.get("/users", socketController.getConnectedUsers);
router.get("/rooms", socketController.getActiveRooms);
router.post("/notify-room", socketController.pushNotificationToRoom);
export { router as SocketRouter };
