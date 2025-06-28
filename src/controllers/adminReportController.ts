import { Request, Response } from 'express';
import * as adminReportService from '../services/adminReportService';

export async function getBookingSummary(req: Request, res: Response) {
  try {
    const { from, to, status, tripId, agentId } = req.query;

    const summary = await adminReportService.getBookingSummary({
      from: from as string,
      to: to as string,
      status: status as string,
      tripId: tripId as string,
      agentId: agentId as string,
    });

    res.json(summary);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to get booking summary' });
  }
}

export async function getRouteSummary(req: Request, res: Response) {
  try {
    const { routeId } = req.params;
    if (!routeId) return res.status(400).json({ error: 'routeId is required' });

    const summary = await adminReportService.getRouteSummary(routeId);
    res.json(summary);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to get route summary' });
  }
}

export async function getTripSummary(req: Request, res: Response) {
  try {
    const { tripId } = req.params;
    if (!tripId) return res.status(400).json({ error: 'tripId is required' });

    const summary = await adminReportService.getTripSummary(tripId);
    res.json(summary);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to get trip summary' });
  }
}

export async function getPassengerReport(req: Request, res: Response) {
  const { userId } = req.params;

  try {
    const bookings = await adminReportService.getPassengerBookings(userId);

    if (!bookings.length) {
      return res.status(404).json({ error: 'No bookings found for this user' });
    }

    const total = bookings.length;
    const confirmed = bookings.filter(b => b.status === 'confirmed').length;
    const canceled = bookings.filter(b => b.status === 'canceled').length;
    const noShow = bookings.filter(b => b.status === 'confirmed' && !b.checkinDone).length;
    const revenue = bookings.reduce((sum, b) => sum + (b.status === 'confirmed' ? b.amountPaid : 0), 0);
    const noShowRate = confirmed > 0 ? parseFloat(((noShow / confirmed) * 100).toFixed(2)) : 0;

    res.json({
      userId,
      totalBookings: total,
      totalConfirmed: confirmed,
      totalCanceled: canceled,
      totalRevenue: revenue,
      noShow,
      noShowRate,
      routesUsed: [...new Set(bookings.map(b => `${b.trip.route.origin} ⇄ ${b.trip.route.destination}`))],
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch passenger report' });
  }
}

export async function adminOverview(req: Request, res: Response) {
  try {
    const data = await adminReportService.getAdminOverview();
    res.json(data);
  } catch (error) {
    console.error("Erro ao obter visão geral:", error);
    res.status(500).json({ error: "Erro ao obter visão geral" });
  }
}

export async function getDashboard(req: Request, res: Response) {
  try {
    const { from, to } = req.query;
    const data = await adminReportService.getDashboardData({ from: from as string, to: to as string });
    res.json(data);
  } catch (error) {
    console.error('Erro ao obter dados do dashboard:', error);
    res.status(500).json({ error: 'Erro ao obter dados do dashboard' });
  }
}