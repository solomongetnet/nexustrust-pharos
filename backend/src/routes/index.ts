import { Router } from "express";
import { UsersRouter } from "./users.routes.js";
import { TodoRouter } from "./todo.routes.js";
import { SocketRouter } from "./socket.routes.js";
import { JobRouter } from "./job.routes.js";

const rootRouter = Router();

// All routes
rootRouter.use("/users", UsersRouter);
rootRouter.use("/todos", TodoRouter);
rootRouter.use("/socket", SocketRouter);
rootRouter.use("/jobs", JobRouter);

export default rootRouter;
