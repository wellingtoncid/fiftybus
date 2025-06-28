import { Request, Response } from 'express';
import * as bookingService from '../services/bookingService';

const bookingController = {
  async createBooking(req: Request, res: Response) {
    try {
      const booking = await bookingService.createBooking(req.body);
      res.locals.entityId = booking.id;
      res.locals.metadata = { tripId: booking.tripId, amount: booking.amountPaid };
      res.status(201).json(booking);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to create booking' });
    }
  },

  async createBookingByAgent(req: Request, res: Response) {
    try {
      const booking = await bookingService.createBookingByAgent(req.body);
      res.status(201).json(booking);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to create booking by agent' });
    }
  },

  async getBookingById(req: Request, res: Response) {
    try {
      const booking = await bookingService.getBookingById(req.params.id);
      if (!booking) return res.status(404).json({ error: 'Booking not found' });
      res.json(booking);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve booking' });
    }
  },

  async listBookings(req: Request, res: Response) {
    try {
      const bookings = await bookingService.listAllBookings();
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ error: 'Failed to list bookings' });
    }
  },

  async getBookingsByUser(req: Request, res: Response) {
    try {
      const bookings = await bookingService.getBookingsByUser(req.params.userId);
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get bookings for user' });
    }
  },

  async getBookingsByAgent(req: Request, res: Response) {
    try {
      const bookings = await bookingService.getBookingsByAgent(req.params.agentId);
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get bookings for agent' });
    }
  },

  async cancelBooking(req: Request, res: Response) {
    try {
      const cancelled = await bookingService.cancelBooking(req.params.id);
      res.locals.entityId = req.params.id;
      res.locals.metadata = { canceledBy: req.user?.id };
      res.json({ message: 'Booking cancelled', booking: cancelled });
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to cancel booking' });
    }
  },

  async updateBooking(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = req.body;
      const updatedBooking = await bookingService.updateBooking(id, data);
      res.json(updatedBooking);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to update booking' });
    }
  },
};

export default bookingController;
