import { PrismaClient, TripStatus } from '@prisma/client';
const prisma = new PrismaClient();

export async function createTrip(data: {
  routeId: string;
  vehicleId: string;
  departureDate: Date;
  departureTime: string;
  minQuota: number;
  estimatedCost: number;
}) {
  return prisma.trip.create({
    data: {
      routeId: data.routeId,
      vehicleId: data.vehicleId,
      departureDate: data.departureDate,
      departureTime: data.departureTime,
      status: 'open',
      minQuota: data.minQuota,
      estimatedCost: data.estimatedCost,
      currentBookings: 0,
      quorumReached: false,
    },
  });
}

export async function getTripById(id: string) {
  return prisma.trip.findUnique({
    where: { id },
    include: {
      route: true,
      vehicle: true,
      bookings: true,
    },
  });
}

export async function updateTripStatus(id: string, status: TripStatus) {
  return prisma.trip.update({
    where: { id },
    data: { status },
  });
}
