import { Request, Response } from 'express';
import * as checkinService from '../services/checkinService';
import { prisma } from '../lib/prisma';

export async function checkin(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const updatedBooking = await checkinService.doCheckin(id);
    res.json({ message: 'Check-in realizado com sucesso', booking: updatedBooking });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Erro ao realizar check-in' });
  }
}
export async function checkinStatus(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const checkinDone = await checkinService.getCheckinStatus(id);
    res.json({ checkinDone });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Erro ao verificar status do check-in' });
  }
}

export const checkinController = {
  async doCheckin(req: Request, res: Response) {
    const { bookingId } = req.params;

    try {
      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: { trip: true },
      });

      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
      }

      if (booking.status !== 'confirmed') {
        return res.status(400).json({ error: 'Booking is not confirmed' });
      }

      if (['completed', 'canceled'].includes(booking.trip.status)) {
        return res.status(400).json({ error: 'Trip is not valid for check-in' });
      }

      const updated = await prisma.booking.update({
        where: { id: bookingId },
        data: { checkinDone: true },
      });

      return res.json({ message: 'Check-in done successfully', booking: updated });
    } catch (err) {
      console.error('❌ Check-in failed:', err);
      return res.status(500).json({ error: 'Failed to perform check-in' });
    }
  },
};
