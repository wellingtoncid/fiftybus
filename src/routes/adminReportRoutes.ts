import { Router } from 'express';
import {
  getBookingSummary,
  getRouteSummary,
  getTripSummary,
  getPassengerReport,
  adminOverview,
} from '../controllers/adminReportController';

const router = Router();

// Summary of all bookings with optional filters
router.get('/bookings/summary', getBookingSummary);

// Summary stats by route
router.get('/routes/:routeId/summary', getRouteSummary);

// Summary stats by trip
router.get('/trips/:tripId/summary', getTripSummary);

// Passenger booking report by userId
router.get('/passengers/:userId/report', getPassengerReport);

// Admin overview with various stats
router.post('/overview', adminOverview);

export default router;
