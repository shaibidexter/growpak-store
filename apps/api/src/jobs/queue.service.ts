import { prisma } from '../config/db';
import { logger } from '../config/logger';

export type JobHandler = (payload: any) => Promise<void>;

export class QueueService {
  private static instance: QueueService;
  private handlers = new Map<string, JobHandler>();
  private pollingInterval: NodeJS.Timeout | null = null;
  private isProcessing = false;

  private constructor() {}

  public static getInstance(): QueueService {
    if (!QueueService.instance) {
      QueueService.instance = new QueueService();
    }
    return QueueService.instance;
  }

  public registerWorker(jobType: string, handler: JobHandler): void {
    this.handlers.set(jobType, handler);
    logger.info({ jobType }, 'Registered background job worker');
  }

  public async dispatch(jobType: string, payload: any, options?: { queueName?: string; runAt?: Date }): Promise<bigint> {
    const job = await prisma.job.create({
      data: {
        jobType,
        queueName: options?.queueName || 'default',
        payloadJson: payload,
        status: 'PENDING',
        runAt: options?.runAt || new Date(),
      },
    });

    logger.debug({ jobId: job.id, jobType }, 'Dispatched background job to MySQL queue');
    return job.id;
  }

  public startQueueWorker(intervalMs = 3000): void {
    if (this.pollingInterval) return;

    logger.info('Starting native in-process DB queue worker loop...');
    this.pollingInterval = setInterval(async () => {
      if (this.isProcessing) return;
      this.isProcessing = true;
      try {
        await this.processNextBatch();
      } catch (err) {
        logger.error({ err }, 'Error in queue poller loop');
      } finally {
        this.isProcessing = false;
      }
    }, intervalMs);
  }

  public stopQueueWorker(): void {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
      logger.info('Stopped background queue worker loop');
    }
  }

  private async processNextBatch(): Promise<void> {
    const now = new Date();
    // Grab pending jobs that are ready to run
    const pendingJobs = await prisma.job.findMany({
      where: {
        status: 'PENDING',
        runAt: { lte: now },
      },
      take: 5,
      orderBy: { createdAt: 'asc' },
    });

    for (const job of pendingJobs) {
      const handler = this.handlers.get(job.jobType);
      if (!handler) {
        logger.warn({ jobType: job.jobType }, 'No worker registered for job type; skipping');
        continue;
      }

      // Mark as PROCESSING
      await prisma.job.update({
        where: { id: job.id },
        data: {
          status: 'PROCESSING',
          lockedAt: new Date(),
          attempts: { increment: 1 },
        },
      });

      try {
        await handler(job.payloadJson);
        await prisma.job.update({
          where: { id: job.id },
          data: {
            status: 'COMPLETED',
            completedAt: new Date(),
          },
        });
        logger.info({ jobId: job.id, jobType: job.jobType }, 'Background job completed successfully');
      } catch (error: any) {
        const attempts = job.attempts + 1;
        const isFailed = attempts >= job.maxAttempts;
        logger.error({ jobId: job.id, error: error?.message, attempts }, 'Background job execution failed');

        await prisma.job.update({
          where: { id: job.id },
          data: {
            status: isFailed ? 'FAILED' : 'PENDING',
            errorLog: error?.stack || error?.message || 'Unknown error',
            runAt: isFailed ? job.runAt : new Date(Date.now() + 30000), // Retry in 30s
          },
        });
      }
    }
  }
}

export const queue = QueueService.getInstance();
