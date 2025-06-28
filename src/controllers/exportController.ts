import { Request, Response } from 'express';
import { exportAuditLogsReport, exportBookingsReport } from '../services/exportService';
import path from 'path';  

export async function exportAdminLogReport(req: Request, res: Response) {
  try {
    const filePath = await exportAuditLogsReport();
    return res.download(filePath);
  } catch (error) {
    console.error('Erro ao exportar relatório:', error);
    return res.status(500).json({ error: 'Erro ao exportar relatório' });
  }
}

export async function exportAdminBookingReport(req: Request, res: Response) {
  try {
    const filePath = await exportBookingsReport();
    return res.download(filePath);
  } catch (error) {
    console.error('Erro ao exportar relatório de reservas:', error);
    return res.status(500).json({ error: 'Erro ao exportar relatório de reservas' });
  }
}

