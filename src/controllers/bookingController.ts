import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const bookingController = {
  async createBooking(req: Request, res: Response) {
    try {
      const data = req.body;
      const booking = await prisma.booking.create({ data });
      return res.status(201).json(booking);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to create booking' });
    }
  },

  async getBookingById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const booking = await prisma.booking.findUnique({ where: { id } });
      if (!booking) return res.status(404).json({ error: 'Booking not found' });
      return res.json(booking);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to retrieve booking' });
    }
  },

  async listBookings(req: Request, res: Response) {
    try {
      const bookings = await prisma.booking.findMany();
      return res.json(bookings);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to list bookings' });
    }
  },

  async updateBooking(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = req.body;
      const updated = await prisma.booking.update({
        where: { id },
        data,
      });
      return res.json(updated);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to update booking' });
    }
  },

  async deleteBooking(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await prisma.booking.delete({ where: { id } });
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: 'Failed to delete booking' });
    }
  },

  async cancelledBooking(req: Request, res: Response) {
    try {
      const { id } = req.params;
      // Verifica se a booking existe
      const booking = await prisma.booking.findUnique({ where: { id } });
      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
      }

      // Se já estiver cancelada, não tenta cancelar de novo
      if (booking.status === 'canceled') {
        return res.status(400).json({ error: 'Booking already cancelled' });
      }

      // Atualiza o status para 'canceled'
      const cancelledBooking = await prisma.booking.update({
        where: { id },
        data: { status: 'canceled' }
      });

      res.status(200).json({ message: 'Booking cancelled successfully', booking: cancelledBooking });
    } catch (error) {
      res.status(500).json({ error: 'Error cancelling booking', details: error });
    }
  }
};

export default bookingController;
