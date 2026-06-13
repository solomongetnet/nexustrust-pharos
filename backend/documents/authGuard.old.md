import { Request, Response, NextFunction } from "express";
import { auth } from "../lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";
import { UserRoleType } from "../types/user-roles.type.js";

export type RoleGuardProps = {
  accessedBy?: UserRoleType[];
  cantAccessBy?: UserRoleType[];
} & (
  | { accessedBy: UserRoleType[]; cantAccessBy?: never }
  | { cantAccessBy: UserRoleType[]; accessedBy?: never }
);

export const authGuard = (options?: RoleGuardProps) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authSession = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
      });

      if (!authSession?.user?.id) {
        return res.status(401).json({ message: "User not logged in" });
      }

      const sessionUser = authSession.user;
      const userRole = sessionUser.role as UserRoleType;

      (req as any).user = { ...sessionUser }; // assign user to req.user safely

      // If no role, just check login
      if (!options) return next();

      // Role-based checks
      if (
        options.cantAccessBy &&
        userRole &&
        options.cantAccessBy.includes(userRole)
      ) {
        return res
          .status(403)
          .json({ message: "You are not allowed to access this resource" });
      }

      if (
        options.accessedBy &&
        userRole &&
        !options.accessedBy.includes(userRole)
      ) {
        return res.status(403).json({
          message: "You don't have permission to access this resource",
        });
      }

      return next();
    } catch (err) {
      console.error("AuthGuard error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  };
};

