import { PrismaClient, VehicleStatus } from '@prisma/client';
const prisma = new PrismaClient();

export async function createVehicle(data: {
  model: string;
  plate: string;
  capacity: number;
  year: number;
  status: VehicleStatus;
  driverId: string;
  mileage: number; // Added mileage property
}) {
  return prisma.vehicle.create({
    data,
  });
}

export async function getVehicleById(id: string) {
  return prisma.vehicle.findUnique({
    where: { id },
    include: {
      driver: true,
      trips: true,
      checklists: true,
    },
  });
}

export async function updateVehicleStatus(id: string, status: VehicleStatus) {
  return prisma.vehicle.update({
    where: { id },
    data: { status },
  });
}
  