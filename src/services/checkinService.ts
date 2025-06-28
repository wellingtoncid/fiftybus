import { prisma } from '../lib/prisma';

export async function doCheckin(bookingId: string) {
  // Verifica se a reserva existe e está confirmada
  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking) throw new Error('Booking not found');
  if (booking.status !== 'confirmed') throw new Error('Booking not confirmed');

  // Atualiza o checkinDone
  return prisma.booking.update({
    where: { id: bookingId },
    data: { checkinDone: true },
  });
}

export async function getCheckinStatus(bookingId: string) {
  // Busca a reserva e retorna o status do checkin
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    select: { checkinDone: true },
  });
  if (!booking) throw new Error('Booking not found');
  return booking.checkinDone;
}