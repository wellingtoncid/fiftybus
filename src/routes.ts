import express from 'express';
import tripController from './controllers/tripController';
import bookingController from './controllers/bookingController';
import userController from './controllers/userController';
import paymentRoutes from './routes/paymentRoutes';
import { asyncHandler } from './utils/asyncHandler';
import * as routeController from './controllers/routeController';
import routeRoutes from './routes/routeRoutes';
import { vehicleController } from './controllers/vehicleController';
import tripRoutes from './routes/tripRoutes';
import checkinRoutes from './routes/checkingRoutes';
import reviewRoutes from './routes/reviewRoutes';
import reportRoutes from './routes/reportRoutes';
import checklistRoutes from './routes/checklistRoutes';
import protectedTestRoutes from './routes/protectedTestRoute';
import adminRoutes from './routes/adminRoutes';

const router = express.Router();

// Trips
router.post('/trips', asyncHandler(tripController.createTrip));
router.get('/trips/:id', asyncHandler(tripController.getTripById));
router.get('/trips', asyncHandler(tripController.listTrips));
router.put('/trips/:id', asyncHandler(tripController.updateTrip));
router.delete('/trips/:id', asyncHandler(tripController.deleteTrip));
router.use('/trips', tripRoutes);

// Bookings
router.post('/bookings', asyncHandler(bookingController.createBooking));
router.get('/bookings/:id', asyncHandler(bookingController.getBookingById));
router.get('/bookings', asyncHandler(bookingController.listBookings));
router.put('/bookings/:id', asyncHandler(bookingController.updateBooking));
router.delete('/bookings/:id', asyncHandler(bookingController.cancelBooking));

// Users
router.post('/users', asyncHandler(userController.createUser));
router.get('/users/:id', asyncHandler(userController.getUserById));
router.get('/users', asyncHandler(userController.listUsers));
router.put('/users/:id', asyncHandler(userController.updateUser));
router.delete('/users/:id', asyncHandler(userController.deleteUser));

// Payments
router.use("/payments", paymentRoutes);

// Routes
router.post('/routes', routeController.createRoute);
router.get('/routes/:id', routeController.getRouteById);
router.put('/routes/:id', routeController.updateRoute);
router.use( "/routes", routeRoutes);

// Vehicles
router.post('/vehicles', vehicleController.createVehicle);
router.get('/vehicles/:id', vehicleController.getVehicleById);
router.get('/vehicles', vehicleController.listVehicles);
router.put('/vehicles/:id', vehicleController.updateVehicle);
router.delete('/vehicles/:id', vehicleController.deleteVehicle);

// Check-in
router.use('/checkin', checkinRoutes);

// Vehicle Checklists
router.use('/checklist', checklistRoutes);

// Reviews
router.use('/reviews', reviewRoutes);

// Reports
router.use('/reports', reportRoutes);

// Protected Test Routes
router.use('/protected', protectedTestRoutes);

// Audit Logs
router.use('/admin', adminRoutes);

export default router;
