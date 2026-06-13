import { Router } from "express";
import todoController from "../controllers/todo.controller.js";

const router = Router();

// @/todos
router.get("/", todoController.getAllTodos);
router.get("/:id", todoController.getSingleTodo);
router.post("/", todoController.createTodo);
router.put("/:id", todoController.updateTodo);
router.delete("/:id", todoController.deleteTodo);

export { router as TodoRouter };
