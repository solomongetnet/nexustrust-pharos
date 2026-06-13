import { Router } from "express";
import userController from "../controllers/users.controller.js";

const router = Router();

// @/users
router.get("/", userController.getUsers);

export { router as UsersRouter };