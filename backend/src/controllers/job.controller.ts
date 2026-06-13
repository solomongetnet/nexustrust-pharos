import { Request, Response, NextFunction } from "express";
import { addJob } from "../lib/queue.js";
import { QUEUE_NAMES } from "../config/bullmq.config.js";
import {
  NotificationPayload,
  EmailPayload,
  BackgroundTaskPayload
} from "../types/jobs.type.js";

/**
 * JobController
 * Handles production-ready job enqueuing for background processing
 */
const jobController = {
  /**
   * Enqueue a notification job
   */
  async enqueueNotification(req: Request, res: Response, next: NextFunction) {
    try {
      const data: NotificationPayload = req.body;

      const job = await addJob(
        QUEUE_NAMES.NOTIFICATIONS,
        "send-notification",
        {
          ...data,
          metadata: { timestamp: Date.now() }
        }
      );

      res.status(202).json({
        success: true,
        message: "Notification job enqueued successfully",
        jobId: job.id,
        queue: QUEUE_NAMES.NOTIFICATIONS
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Enqueue an email job
   */
  async enqueueEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const data: EmailPayload = req.body;

      const job = await addJob(
        QUEUE_NAMES.EMAILS,
        "send-email",
        {
          ...data,
          metadata: { timestamp: Date.now() }
        }
      );

      res.status(202).json({
        success: true,
        message: "Email job enqueued successfully",
        jobId: job.id,
        queue: QUEUE_NAMES.EMAILS
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Enqueue a generic background task
   */
  async enqueueTask(req: Request, res: Response, next: NextFunction) {
    try {
      const { taskType, payload, priority }: BackgroundTaskPayload = req.body;

      const job = await addJob(
        QUEUE_NAMES.ANALYTICS, // Using analytics queue for generic tasks as per infrastructure
        taskType,
        {
          payload,
          metadata: { timestamp: Date.now() }
        },
        { priority }
      );

      res.status(202).json({
        success: true,
        message: "Background task job enqueued successfully",
        jobId: job.id,
        queue: QUEUE_NAMES.ANALYTICS
      });
    } catch (error) {
      next(error);
    }
  }
};

export default jobController;
