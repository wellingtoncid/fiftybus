import { PrismaClient, BookingStatus, PaymentMethod } from '@prisma/client';
const prisma = new PrismaClient();

export async function createBooking(data: {
  tripId: string;
  userId: string;
  amountPaid: number;
  paymentMethod: PaymentMethod;
}) {
  return prisma.booking.create({
    data: {
      tripId: data.tripId,
      userId: data.userId,
      amountPaid: data.amountPaid,
      paymentMethod: data.paymentMethod,
      status: 'pending',
    },
  });
}

export async function getBookingById(id: string) {
  return prisma.booking.findUnique({
    where: { id },
    include: {
      trip: true,
      user: true,
      payment: true,
    },
  });
}

export async function updateBookingStatus(id: string, status: BookingStatus) {
  return prisma.booking.update({
    where: { id },
    data: { status },
  });
}

export async function cancelBooking(id: string) {
    // Verifica se o booking existe
    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking) {
      throw new Error('Booking not found');
    }

    // Atualiza o status para "cancelled"
    const cancelledBooking = await prisma.booking.update({
      where: { id },
      data: { status: 'canceled' }, // Corrigido para o valor correto do enum BookingStatus
    });

    return cancelledBooking;
  }

