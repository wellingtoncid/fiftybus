import { Request, Response } from 'express';
import * as reportService from '../services/reportService';

export async function createReport(req: Request, res: Response) {
  try {
    const report = await reportService.createReport(req.body);
    res.status(201).json(report);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create report', details: error });
  }
}

export async function getReportById(req: Request, res: Response) {
  try {
    const report = await reportService.getReportById(req.params.id);
    if (!report) return res.status(404).json({ error: 'Report not found' });
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get report', details: error });
  }
}

export async function listReports(req: Request, res: Response) {
  try {
    const reports = await reportService.listReportsFiltered(req.query);
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: 'Failed to list reports', details: error });
  }
}

export async function updateReport(req: Request, res: Response) {
  try {
    const report = await reportService.updateReport(req.params.id, req.body);
    res.json(report);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update report', details: error });
  }
}

export async function deleteReport(req: Request, res: Response) {
  try {
    await reportService.deleteReport(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete report', details: error });
  }
}

export async function salesSummary(req: Request, res: Response) {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'startDate and endDate are required' });
    }

    const start = new Date(startDate as string);
    const end = new Date(endDate as string);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ error: 'Invalid date format' });
    }

    const totalSales = await reportService.getSalesSummary(start, end);
    res.json({ totalSales });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get sales summary', details: error });
  }
}