import express from 'express';
import tripController from './controllers/tripController';
import bookingController from './controllers/bookingController';
import userController from './controllers/userController';
import paymentRoutes from './routes/paymentRoutes';
import { asyncHandler } from './utils/asyncHandler';

const router = express.Router();

// Trips
router.post('/trips', asyncHandler(tripController.createTrip));
router.get('/trips/:id', asyncHandler(tripController.getTripById));
router.get('/trips', asyncHandler(tripController.listTrips));
router.put('/trips/:id', asyncHandler(tripController.updateTrip));
router.delete('/trips/:id', asyncHandler(tripController.deleteTrip));

// Bookings
router.post('/bookings', asyncHandler(bookingController.createBooking));
router.get('/bookings/:id', asyncHandler(bookingController.getBookingById));
router.get('/bookings', asyncHandler(bookingController.listBookings));
router.put('/bookings/:id', asyncHandler(bookingController.updateBooking));
router.delete('/bookings/:id', asyncHandler(bookingController.cancelledBooking));

// Users
router.post('/users', asyncHandler(userController.createUser));
router.get('/users/:id', asyncHandler(userController.getUserById));
router.get('/users', asyncHandler(userController.listUsers));
router.put('/users/:id', asyncHandler(userController.updateUser));
router.delete('/users/:id', asyncHandler(userController.deleteUser));

// Payments
router.use("/payments", paymentRoutes);

export default router;
