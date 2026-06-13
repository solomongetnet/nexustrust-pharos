import { Router } from "express";
import metadataController from "../controllers/metadata.controller.js";

const router = Router();

// @/metadata
router.post("/agent", metadataController.uploadAgentMetadata);

export { router as MetadataRouter };
