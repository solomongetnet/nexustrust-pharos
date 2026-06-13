import { Request, Response, NextFunction, RequestHandler } from "express";

/**
 * Wraps async route handlers and forwards errors to Express error middleware.
 * Fully typed, production-safe, no silent failures.
 */
export const tryCatch =
  (
    controller: (
      req: Request,
      res: Response,
      next: NextFunction,
    ) => Promise<void | Response>,
  ): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(controller(req, res, next)).catch(next);
  };
