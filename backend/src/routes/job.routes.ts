import { Router } from "express";
import jobController from "../controllers/job.controller.js";

const router = Router();

/**
 * @/api/jobs/notification
 * Enqueue a notification job
 */
router.post("/notification", jobController.enqueueNotification);

/**
 * @/api/jobs/email
 * Enqueue an email job
 */
router.post("/email", jobController.enqueueEmail);

/**
 * @/api/jobs/task
 * Enqueue a background task
 */
router.post("/task", jobController.enqueueTask);

export { router as JobRouter };
