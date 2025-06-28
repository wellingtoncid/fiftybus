import { prisma } from '../lib/prisma';

export async function assignAgentToTrip(agentId: string, tripId: string) {
  const existing = await prisma.tripAgentAssignment.findFirst({
      where: { agentId, tripId },
    });
    if (existing) throw new Error('Agent already assigned to this trip');

    return prisma.tripAgentAssignment.create({
      data: { agentId, tripId },
    });
  }

export async function assignAgentToRoute(agentId: string, routeId: string) {
  const existing = await prisma.agentAssignment.findFirst({
      where: { agentId, routeId },
    });
    if (existing) throw new Error('Agent already assigned to this route');

    return prisma.agentAssignment.create({
      data: { agentId, routeId },
  });
}

export async function getAgentsByTrip(tripId: string) {
  return prisma.tripAgentAssignment.findMany({
    where: { tripId },
    include: { agent: { include: { user: true } } },
  });
}

export async function getAgentsByRoute(routeId: string) {
  return prisma.agentAssignment.findMany({
    where: { routeId },
    include: { agent: { include: { user: true } } },
  });
}

export async function removeAgentFromTrip(id: string) {
  return prisma.tripAgentAssignment.delete({
    where: { id },
  });
}
