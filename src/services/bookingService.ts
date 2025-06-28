import { PrismaClient, PaymentMethod, Booking } from '@prisma/client';
const prisma = new PrismaClient();

export async function createBooking(data: {
  tripId: string;
  userId: string;
  agentId?: string;
  amountPaid: number;
  paymentMethod: PaymentMethod;
  createdByAgentId?: string;
}) {
  if (data.createdByAgentId) {
    const trip = await prisma.trip.findUnique({
      where: { id: data.tripId },
      include: { route: true },
    });

    if (!trip) throw new Error("Trip not found");

    const isAssignedToTrip = await prisma.tripAgentAssignment.findFirst({
      where: {
        agentId: data.createdByAgentId,
        tripId: data.tripId,
      },
    });

    const isAssignedToRoute = await prisma.agentAssignment.findFirst({
      where: {
        agentId: data.createdByAgentId,
        routeId: trip.routeId,
      },
    });

    if (!isAssignedToTrip && !isAssignedToRoute) {
      throw new Error("Agent not assigned to this trip or its route");
    }
  }

  // Verifica se já existe uma reserva para o mesmo passageiro na mesma viagem
  const existingBooking = await prisma.booking.findFirst({
    where: {
      tripId: data.tripId,
      userId: data.userId,
    },
  });

  if (existingBooking) {
    throw new Error("Booking already exists for this user and trip");
  }

  return prisma.booking.create({
    data: {
      tripId: data.tripId,
      userId: data.userId,
      amountPaid: data.amountPaid,
      paymentMethod: data.paymentMethod,
      status: 'pending',
      agentId: data.createdByAgentId || null,
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

export async function updateBooking(id: string, data: Partial<Booking>) {
  // Se data.status existir, converta para o formato prisma usando set
  const updateData = {
    ...data,
    ...(data.status ? { status: { set: data.status } } : {}),
  };
  // Remove status simples para evitar conflito
  if (updateData.status && typeof updateData.status !== 'object') {
    delete updateData.status;
  }

  return prisma.booking.update({
    where: { id },
    data: updateData,
  });
}

export async function cancelBooking(id: string) {
  const booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking) {
    throw new Error('Booking not found');
  }

  return prisma.booking.update({
    where: { id },
    data: { status: 'canceled' },
  });
}

export async function createBookingByAgent(data: {
  tripId: string;
  userId: string;
  amountPaid: number;
  paymentMethod: PaymentMethod;
  agentId: string;
}) {
  return prisma.booking.create({
    data: {
      tripId: data.tripId,
      userId: data.userId,
      amountPaid: data.amountPaid,
      paymentMethod: data.paymentMethod,
      status: 'confirmed',
      agentId: data.agentId,
    },
  });
}

export async function getBookingsByUser(userId: string) {
  return prisma.booking.findMany({
    where: { userId },
    include: {
      trip: true,
    },
    orderBy: { bookedAt: 'desc' },
  });
}

export async function getBookingsByAgent(agentId: string) {
  return prisma.booking.findMany({
    where: { agentId },
    include: {
      trip: true,
    },
    orderBy: { bookedAt: 'desc' },
  });
}

export async function listAllBookings() {
  return prisma.booking.findMany({
    include: {
      trip: {
        include: {
          route: true,
        },
      },
      user: true,
    },
    orderBy: { bookedAt: 'desc' },
  });
}
