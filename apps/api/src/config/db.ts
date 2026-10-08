import { PrismaClient } from '@prisma/client';
import { logger } from './logger';

// Allow BigInt to serialize cleanly to JSON as string/number
(BigInt.prototype as any).toJSON = function () {
  const intVal = Number(this);
  return Number.isSafeInteger(intVal) ? intVal : this.toString();
};

export const prisma = new PrismaClient({
  log: [
    { emit: 'event', level: 'error' },
    { emit: 'event', level: 'warn' },
  ],
});

prisma.$on('error' as never, (e: any) => {
  logger.error({ err: e }, 'Prisma error');
});

prisma.$on('warn' as never, (e: any) => {
  logger.warn({ warn: e }, 'Prisma warning');
});
