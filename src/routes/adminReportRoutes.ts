import { Router } from 'express';
import {
  getBookingSummary,
  getRouteSummary,
  getTripSummary,
  getPassengerReport,
  adminOverview,
  getDashboard
} from '../controllers/adminReportController';

const router = Router();

// Summary of all bookings with optional filters
router.get('/admin/bookings/summary', getBookingSummary);

// Summary stats by route
router.get('/admin/routes/:routeId/summary', getRouteSummary);

// Summary stats by trip
router.get('/admin/trips/:tripId/summary', getTripSummary);

// Passenger booking report by userId
router.get('/admin/passengers/:userId/report', getPassengerReport);

// Admin overview with various stats
router.post('/overview', adminOverview);

// Dashboard with aggregated data
router.get('/dashboard', getDashboard);


export default router;
