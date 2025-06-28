import { Router } from 'express';
import bookingController from '../controllers/bookingController';
import { auditLog } from '../middlewares/auditMiddleware';

const router = Router();

router.post('/bookings', auditLog('create', 'Booking'), bookingController.createBooking);
router.post('/agent', bookingController.createBookingByAgent);
router.put('/bookings/:id', auditLog('update', 'Booking'), bookingController.updateBooking);
router.get('/', bookingController.listBookings);
router.get('/user/:userId', bookingController.getBookingsByUser);
router.get('/agent/:agentId', bookingController.getBookingsByAgent);
router.post('/:id/cancel', bookingController.cancelBooking);
router.put('/bookings/:id/cancel', bookingController.cancelBooking);
router.put('/bookings/:id',(bookingController.updateBooking));
router.delete('/bookings/:id', auditLog('cancel', 'Booking'), bookingController.cancelBooking);

export default router;