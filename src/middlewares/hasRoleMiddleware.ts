import { Request, Response, NextFunction } from 'express';

export function hasRole(role: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    next();
  };
}