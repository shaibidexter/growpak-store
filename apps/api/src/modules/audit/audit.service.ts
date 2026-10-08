import { prisma } from '../../config/db';
import { logger } from '../../config/logger';

export interface AuditLogParams {
  userId?: bigint;
  action: string;
  entityType: string;
  entityId?: string;
  oldValues?: any;
  newValues?: any;
  ipAddress?: string;
  userAgent?: string;
}

export class AuditService {
  public static async log(params: AuditLogParams): Promise<void> {
    try {
      await prisma.auditLog.create({
        data: {
          userId: params.userId,
          action: params.action,
          entityType: params.entityType,
          entityId: params.entityId,
          oldValuesJson: params.oldValues ?? undefined,
          newValuesJson: params.newValues ?? undefined,
          ipAddress: params.ipAddress,
          userAgent: params.userAgent,
        },
      });
    } catch (err) {
      logger.error({ err, params }, 'Failed to write audit log record');
    }
  }
}
