import { Router } from "express";
import userController from "../controllers/users.controller.js";

const router = Router();

// @/users
router.get("/", userController.getUsers);
router.post("/get-or-create", userController.getOrCreateUser);
router.get("/wallet/:walletAddress", userController.getUserByWalletAddress);

export { router as UsersRouter };