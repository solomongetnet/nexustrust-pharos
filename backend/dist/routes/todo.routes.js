import { Router } from "express";
import todoController from "../controllers/todo.controller.js";
const router = Router();
// @/todos
router.get("/", todoController.getAllTodos);
router.post("/", todoController.createTodo);
router.put("/:id", todoController.updateTodo);
export { router as TodoRouter };
