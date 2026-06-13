import { Router } from "express";
import { MetadataRouter } from "./metadata.routes.js";

const rootRouter = Router();

// All routes
rootRouter.use("/metadata", MetadataRouter);

export default rootRouter;
