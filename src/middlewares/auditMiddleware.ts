import { Request, Response, NextFunction } from 'express';
import { auditLogService } from '../services/auditLogService';

export function auditLog(action: string, entity: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    res.on('finish', async () => {
      if (res.statusCode < 400) {
        const userId = (req as any).user?.id;
        const entityId = res.locals?.entityId;
        const metadata = res.locals?.metadata;

        await auditLogService.log({
          userId,
          action,
          entity,
          entityId,
          metadata,
        });
      }
    });
    next();
  };
}

export async function auditMiddleware(req: Request, res: Response, next: NextFunction) {
  const user = req.user;
  if (user) {
    await auditLogService.log({
      userId: user.id,
      action: `${req.method} ${req.originalUrl}`,
      metadata: {
        ip: req.ip,
        userAgent: req.headers['user-agent'] || '',
      },
    });
  }
  next();
}
