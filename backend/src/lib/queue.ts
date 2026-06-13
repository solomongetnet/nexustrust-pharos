import { Queue, Worker, Job, Processor, QueueEvents } from "bullmq";
import { 
  baseQueueOptions, 
  baseWorkerOptions, 
  QueueName 
} from "../config/bullmq.config.js";
import { ioRedisConnection } from "../config/redis.config.js";

// Keep track of active queues and workers for graceful shutdown
const activeQueues: Map<string, Queue<any, any, any>> = new Map();
const activeWorkers: Map<string, Worker<any, any, any>> = new Map();

/**
 * Queue Factory
 * Ensures singleton pattern per queue name
 */
export const getQueue = <T = any, R = any, N extends string = string>(
  name: QueueName | N
): Queue<T, R, N> => {
  if (!activeQueues.has(name)) {
    const queue = new Queue<T, R, N>(name, baseQueueOptions);
    
    // Add event listeners for monitoring
    const queueEvents = new QueueEvents(name, { connection: ioRedisConnection });
    queueEvents.on("failed", ({ jobId, failedReason }) => {
      console.error(`❌ [Queue:${name}] Job ${jobId} failed: ${failedReason}`);
    });

    activeQueues.set(name, queue);
  }
  return activeQueues.get(name) as Queue<T, R, N>;
};

/**
 * Worker Factory
 * Simplifies worker creation with shared config
 */
export const createWorker = <T = any, R = any, N extends string = string>(
  name: QueueName | N,
  processor: Processor<T, R, N>,
  options = {}
): Worker<T, R, N> => {
  const worker = new Worker<T, R, N>(name, processor, {
    ...baseWorkerOptions,
    ...options,
  });

  worker.on("completed", (job: Job) => {
    console.log(`✅ [Worker:${name}] Job ${job.id} completed`);
  });

  worker.on("failed", (job: Job | undefined, err: Error) => {
    console.error(`❌ [Worker:${name}] Job ${job?.id} failed: ${err.message}`);
  });

  activeWorkers.set(name, worker as Worker<any, any, any>);
  return worker;
};

/**
 * Add job to a specific queue with full type support
 */
export const addJob = async <T = any>(
  queueName: QueueName,
  jobName: string,
  data: T,
  opts = {}
) => {
  const queue = getQueue(queueName);
  return queue.add(jobName, data, opts);
};

/**
 * Graceful Shutdown Handling
 */
export const shutdownQueues = async () => {
  console.log("Shutting down BullMQ...");
  
  const workerPromises = Array.from(activeWorkers.values()).map(w => w.close());
  const queuePromises = Array.from(activeQueues.values()).map(q => q.close());

  await Promise.all([...workerPromises, ...queuePromises]);
  console.log("BullMQ shutdown complete.");
};
