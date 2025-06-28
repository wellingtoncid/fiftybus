import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function createRoute(data: {
  origin: string;
  destination: string;
  estimatedTime: string;
  distanceKm: number;
  basePrice: number;
  minPassengers: number;
}) {
  return prisma.route.create({
    data: {
      ...data,
      isActive: true,
    },
  });
}

export async function getRouteById(id: string) {
  return prisma.route.findUnique({
    where: { id },
  });
}

export async function deactivateRoute(id: string) {
  return prisma.route.update({
    where: { id },
    data: { isActive: false },
  });
}

export async function updateRoute(id: string, data: any) {
  return await prisma.route.update({
    where: { id },
    data,
  });
}
