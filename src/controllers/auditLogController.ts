import { Request, Response } from 'express';
import { exportLogsToCsv } from '../utils/exportUtils';
import { prisma } from '../lib/prisma';

export async function exportAuditLogs(req: Request, res: Response) {
  const logs = await prisma.auditLog.findMany();
  const filePath = await exportLogsToCsv(logs);
  res.download(filePath, 'audit-logs.csv');
}