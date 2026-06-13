import { Request, Response, NextFunction } from "express";
import { auth } from "../lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";

export const authGuard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authSession = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!authSession?.user?.id) {
      return res.status(401).json({
        message: "User not logged in",
      });
    }

    const sessionUser = authSession.user;

    (req as any).user = { ...sessionUser };

    return next();
  } catch (err) {
    console.error("AuthGuard error:", err);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};