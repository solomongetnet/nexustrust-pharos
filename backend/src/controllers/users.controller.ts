import { NextFunction, Request, Response } from "express";
import { prisma } from "../config/prisma.config.js";

const userController = {
  async getUsers(req: Request, res: Response, next: NextFunction) {
    const users = await prisma.user.findMany();
    res.json({
      users,
      message: "this is users",
    });
  },
};

export default userController;
