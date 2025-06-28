import { ChecklistType, Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';

interface ChecklistData {
  tripId: string;
  vehicleId: string;
  driverId: string;
  type: ChecklistType;
  initialMileage: number;
  finalMileage?: number;
  fuelLevel: number;
  brakesOk: boolean;
  tiresOk: boolean;
  oilOk: boolean;
  issuesFound?: string;
  notes?: string;
}

export const tripChecklistService = {
  async createChecklist(data: ChecklistData) {

    const exists = await prisma.tripChecklist.findUnique({
      where: {
        tripId_type: {
          tripId: data.tripId,
          type: data.type,
        },
      },
    });

    if (exists) {
      throw new Error(`Checklist of type '${data.type}' already exists for this trip.`);
    }

    const checklist = await prisma.tripChecklist.create({ data });

    if (data.type === ChecklistType.end) {
      // Finaliza a viagem
      await prisma.trip.update({
        where: { id: data.tripId },
        data: { status: 'completed' },
      });

      // Verifica se há problemas e emite alerta no console
      const alertaNecessario =
        data.issuesFound || !data.brakesOk || !data.tiresOk || !data.oilOk;

      if (alertaNecessario) {
        const users = await prisma.user.findMany({
          where: {
            role: { in: ['admin', 'manager', 'agent'] },
            isActive: true,
          },
          select: { email: true, name: true },
        });

        users.forEach((user) => {
          console.warn(
            `🚨 ALERTA DE CHECKLIST: Problemas detectados na viagem ${data.tripId}. Notificar ${user.name} <${user.email}>`
          );
        });
      }
    }

    return checklist;
  },

  async getChecklistsByTrip(tripId: string) {
    return prisma.tripChecklist.findMany({
      where: { tripId },
      orderBy: { checkedAt: 'asc' },
    });
  },

  async getProblematicChecklists() {
    return prisma.tripChecklist.findMany({
      where: {
        type: ChecklistType.end,
        OR: [
          { issuesFound: { not: null } },
          { brakesOk: false },
          { tiresOk: false },
          { oilOk: false },
        ],
      },
      orderBy: { checkedAt: 'desc' },
      include: {
        trip: true,
        driver: true,
        vehicle: true,
      },
    });
  },
};