import { prisma } from '../lib/prisma';

export const auditLogService = {
  async log({ userId, action, entity, entityId, metadata }: {
    userId?: string;
    action: string;
    entity?: string;
    entityId?: string;
    metadata?: any;
  }) {
    try {
      await prisma.auditLog.create({
        data: {
          userId,
          action,
          entity: entity ?? '',
          entityId,
          metadata: metadata ? JSON.stringify(metadata) : undefined,
        },
      });
    } catch (err) {
      console.error('Erro ao salvar log de auditoria:', err);
    }
  },
};
