import { NextFunction, Request, Response } from "express";
import { prisma } from "../config/prisma.config.js";
import { isAddress } from "viem";

const userController = {
  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await prisma.user.findMany();
      res.json({
        users,
        message: "this is users",
      });
    } catch (error) {
      next(error);
    }
  },

  async getOrCreateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { walletAddress } = req.body;

      // Validate wallet address
      if (!walletAddress || !isAddress(walletAddress)) {
        return res.status(400).json({ message: "Invalid wallet address" });
      }

      // Try to find existing user
      let user = await prisma.user.findUnique({
        where: { walletAddress },
      });

      // If user doesn't exist, create new one
      if (!user) {
        user = await prisma.user.create({
          data: { walletAddress },
        });
      }

      res.json({
        user,
        message: user.createdAt === user.updatedAt ? "User created successfully" : "User found",
      });
    } catch (error) {
      next(error);
    }
  },

  async getUserByWalletAddress(req: Request, res: Response, next: NextFunction) {
    try {
      const { walletAddress } = req.params;

      if (!isAddress(walletAddress as string)) {
        return res.status(400).json({ message: "Invalid wallet address" });
      }

      const user = await prisma.user.findUnique({
        where: { walletAddress: walletAddress as string },
        include: { agents: true },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ user });
    } catch (error) {
      next(error);
    }
  },
};

export default userController;
