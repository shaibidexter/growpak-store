import { createApp } from './app';
import { env } from './config/env';
import { logger } from './config/logger';
import { prisma } from './config/db';
import { queue } from './jobs/queue.service';

const app = createApp();

const server = app.listen(env.PORT, () => {
  logger.info(`GrowPak Store API listening on port ${env.PORT} (${env.NODE_ENV})`);
  logger.info(`Swagger API docs available at http://localhost:${env.PORT}/docs`);
  
  // Start native DB-backed queue worker loop
  queue.startQueueWorker();
});

// Graceful Shutdown
const shutdown = async (signal: string) => {
  logger.info(`Received ${signal}. Gracefully shutting down...`);
  queue.stopQueueWorker();

  server.close(async () => {
    logger.info('HTTP server closed');
    await prisma.$disconnect();
    logger.info('Database connection closed');
    process.exit(0);
  });

  setTimeout(() => {
    logger.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
