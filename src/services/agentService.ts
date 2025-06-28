import { prisma } from '../lib/prisma';

export async function assignAgentToRoute(agentId: string, routeId: string) {
  return prisma.agentAssignment.create({
    data: { agentId, routeId },
  });
}

export async function assignAgentToTrip(agentId: string, tripId: string) {
  return prisma.tripAgentAssignment.create({
    data: { agentId, tripId },
  });
}

export async function getAgentRoutes(agentId: string) {
  return prisma.agentAssignment.findMany({
    where: { agentId },
    include: { route: true },
  });
}

export async function getAgentTrips(agentId: string) {
  return prisma.tripAgentAssignment.findMany({
    where: { agentId },
    include: { trip: true },
  });
}

export async function getAgentById(agentId: string) {
  return prisma.agent.findUnique({
    where: { id: agentId },
    include: { user: true },
  });
}

export async function getAllAgents() {
  return prisma.agent.findMany({
    include: { user: true },
  });
}

export async function createAgent(data: {
  userId: string;
  region: string;
  commissionRate: number;
}) {
  return prisma.agent.create({
    data,
  });
}
