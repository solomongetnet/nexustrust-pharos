import { NextFunction, Request, Response } from "express";
import { prisma } from "../config/prisma.config.js";
import { cacheService, getTodoCacheKey } from "../services/cache.service.js";

const todoController = {
  /**
   * Get all todos - with Redis caching
   */
  async getAllTodos(req: Request, res: Response, next: NextFunction) {
    try {
      const cacheKey = getTodoCacheKey();
      const cachedTodos = await cacheService.get(cacheKey);

      if (cachedTodos) {
        console.log("[TodoController] Serving from cache: all todos");
        res.json(cachedTodos);
        return;
      }

      const todos = await prisma.todo.findMany();
      await cacheService.set(cacheKey, todos, 3600); // 1 hour TTL

      res.json(todos);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get single todo - with Redis caching
   */
  async getSingleTodo(req: Request, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      const cacheKey = getTodoCacheKey(id);
      const cachedTodo = await cacheService.get(cacheKey);

      if (cachedTodo) {
        console.log(`[TodoController] Serving from cache: todo ${id}`);
        res.json(cachedTodo);
        return;
      }

      const todo = await prisma.todo.findUnique({
        where: { id },
      });

      if (!todo) {
        res.status(404).json({ message: "Todo not found" });
        return;
      }

      await cacheService.set(cacheKey, todo, 3600);
      res.json(todo);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Create todo - invalidates "all todos" cache
   */
  async createTodo(req: Request, res: Response, next: NextFunction) {
    try {
      const { title } = req.body;
      const todo = await prisma.todo.create({
        data: {
          title,
        },
      });

      // Invalidate cache
      await cacheService.del(getTodoCacheKey());

      res.status(201).json(todo);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update todo - invalidates "all" and "single" cache
   */
  async updateTodo(req: Request, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      const { title, completed } = req.body;
      const todo = await prisma.todo.update({
        where: { id },
        data: {
          title,
          completed,
        },
      });

      // Invalidate cache
      await cacheService.del(getTodoCacheKey());
      await cacheService.del(getTodoCacheKey(id));

      res.json(todo);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Delete todo - invalidates "all" and "single" cache
   */
  async deleteTodo(req: Request, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      await prisma.todo.delete({
        where: { id },
      });

      // Invalidate cache
      await cacheService.del(getTodoCacheKey());
      await cacheService.del(getTodoCacheKey(id));

      res.json({ message: "Todo deleted successfully" });
    } catch (error) {
      next(error);
    }
  },
};

export default todoController;
