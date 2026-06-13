import { DefaultJobOptions, WorkerOptions, QueueOptions } from "bullmq";
import { ioRedisConnection } from "./redis.config.js";

/**
 * Centralized BullMQ Configuration
 * Follows production best practices for retries, backoff, and cleanup.
 */

export const DEFAULT_REMOVE_CONFIG = {
  removeOnComplete: {
    age: 3600, // keep up to 1 hour
    count: 1000, // keep up to 1000 jobs
  },
  removeOnFail: {
    age: 24 * 3600, // keep up to 24 hours
  },
};

export const defaultJobOptions: DefaultJobOptions = {
  attempts: 3,
  backoff: {
    type: "exponential",
    delay: 1000,
  },
  ...DEFAULT_REMOVE_CONFIG,
};

export const baseQueueOptions: QueueOptions = {
  connection: ioRedisConnection,
  defaultJobOptions,
};

export const baseWorkerOptions: WorkerOptions = {
  connection: ioRedisConnection,
  concurrency: 5,
  autorun: true,
};

export const QUEUE_NAMES = {
  EMAILS: "email-queue",
  NOTIFICATIONS: "notification-queue",
  ANALYTICS: "analytics-queue",
  MEDIA: "media-queue",
  CRON: "cron-queue",
} as const;

export type QueueName = (typeof QUEUE_NAMES)[keyof typeof QUEUE_NAMES];
