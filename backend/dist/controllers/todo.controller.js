import { prisma } from "../config/prisma.config.js";
const todoController = {
    async getAllTodos(req, res, next) {
        try {
            const todos = await prisma.todo.findMany();
            res.json(todos);
        }
        catch (error) {
            next(error);
        }
    },
    async createTodo(req, res, next) {
        try {
            const { title } = req.body;
            const todo = await prisma.todo.create({
                data: {
                    title,
                },
            });
            res.status(201).json(todo);
        }
        catch (error) {
            next(error);
        }
    },
    async updateTodo(req, res, next) {
        try {
            const { id } = req.params;
            const { title, completed } = req.body;
            const todo = await prisma.todo.update({
                where: { id: String(id) },
                data: {
                    title,
                    completed,
                },
            });
            res.json(todo);
        }
        catch (error) {
            next(error);
        }
    },
};
export default todoController;
