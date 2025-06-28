import { PrismaClient, TripStatus } from '@prisma/client';
const prisma = new PrismaClient();

type CreateTripInput = {
  routeId: string;
  vehicleId: string;
  departureDate: Date;
  departureTime: string;
  minQuota: number;
  estimatedCost: number;
};

async function createTrip(data: CreateTripInput): Promise<any> {
  return await prisma.trip.create({
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

async function getTripById(id: string) {
  return prisma.trip.findUnique({
    where: { id },
    include: {
      route: true,
      vehicle: true,
      bookings: true,
    },
  });
}

async function updateTripStatus(id: string, status: TripStatus) {
  return prisma.trip.update({
    where: { id },
    data: { status },
  });
}

async function listTrips() {
  return await prisma.trip.findMany({
    include: {
      route: true,
      vehicle: true,
    },
  });
}

export const tripService = {
  createTrip,
  getTripById,
  updateTripStatus,
  listTrips,
};  