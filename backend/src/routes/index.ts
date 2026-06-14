import { Router } from "express";
import { MetadataRouter } from "./metadata.routes.js";
import { UsersRouter } from "./users.routes.js";

const rootRouter = Router();

// All routes
rootRouter.use("/metadata", MetadataRouter);
rootRouter.use("/users", UsersRouter);

export default rootRouter;
