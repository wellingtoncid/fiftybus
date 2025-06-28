import { prisma } from '../lib/prisma';
import { parseISO } from 'date-fns/parseISO';

export async function getBookingSummary(filters: {
  from?: string;
  to?: string;
  status?: string;
  tripId?: string;
  agentId?: string;
}) {
  const where: any = {};

  if (filters.status) where.status = filters.status;
  if (filters.tripId) where.tripId = filters.tripId;
  if (filters.agentId) where.agentId = filters.agentId;
  if (filters.from || filters.to) {
    where.bookedAt = {};
    if (filters.from) where.bookedAt.gte = parseISO(filters.from);
    if (filters.to) where.bookedAt.lte = parseISO(filters.to);
  }

  const [
    totalBookings,
    totalConfirmed,
    totalCanceled,
    totalRevenue,
    noShowCount,
    byAgent,
    uniqueUsersRaw
  ] = await Promise.all([
    prisma.booking.count({ where }),
    prisma.booking.count({ where: { ...where, status: 'confirmed' } }),
    prisma.booking.count({ where: { ...where, status: 'canceled' } }),
    prisma.booking.aggregate({
      _sum: { amountPaid: true },
      where: { ...where, status: 'confirmed' },
    }),
    prisma.booking.count({ where: { ...where, status: 'confirmed', checkinDone: false } }),
    prisma.booking.groupBy({
      by: ['agentId'],
      _count: true,
      where,
    }),
    prisma.booking.findMany({
      where,
      distinct: ['userId'],
      select: { userId: true },
    }),
  ]);

  return {
    totalBookings,
    totalConfirmed,
    totalCanceled,
    totalRevenue: totalRevenue._sum.amountPaid || 0,
    noShow: noShowCount,
    uniqueUsers: uniqueUsersRaw.length,
    byAgent: byAgent.map(a => ({ agentId: a.agentId, count: a._count })),
  };
}

export async function getRouteSummary(routeId: string) {
  const trips = await prisma.trip.findMany({
    where: { routeId },
    select: { id: true },
  });

  const tripIds = trips.map(t => t.id);
  if (tripIds.length === 0) {
    return {
      message: 'No trips found for this route',
      routeId,
      tripCount: 0,
    };
  }

  const where = { tripId: { in: tripIds } };

  const [
    totalBookings,
    totalConfirmed,
    totalCanceled,
    totalRevenue,
    noShow,
    distinctUsers,
    topAgents,
  ] = await Promise.all([
    prisma.booking.count({ where }),
    prisma.booking.count({ where: { ...where, status: 'confirmed' } }),
    prisma.booking.count({ where: { ...where, status: 'canceled' } }),
    prisma.booking.aggregate({
      _sum: { amountPaid: true },
      where: { ...where, status: 'confirmed' },
    }),
    prisma.booking.count({ where: { ...where, status: 'confirmed', checkinDone: false } }),
    prisma.booking.findMany({
      where,
      distinct: ['userId'],
      select: { userId: true },
    }),
    prisma.booking.groupBy({
      by: ['agentId'],
      _count: true,
      where,
      orderBy: { _count: { agentId: 'desc' } },
    }),
  ]);

  return {
    routeId,
    tripCount: tripIds.length,
    totalBookings,
    totalConfirmed,
    totalCanceled,
    totalRevenue: totalRevenue._sum.amountPaid || 0,
    noShow,
    uniqueUsers: distinctUsers.length,
    noShowRate: totalConfirmed > 0 ? (noShow / totalConfirmed) * 100 : 0,
    topAgents: topAgents.map(a => ({
      agentId: a.agentId,
      count: a._count,
    })),
  };
}

export async function getTripSummary(tripId: string) {
  const where = { tripId };

  const [
    totalBookings,
    totalConfirmed,
    totalCanceled,
    totalRevenue,
    noShow,
    distinctUsers,
    topAgents,
  ] = await Promise.all([
    prisma.booking.count({ where }),
    prisma.booking.count({ where: { ...where, status: 'confirmed' } }),
    prisma.booking.count({ where: { ...where, status: 'canceled' } }),
    prisma.booking.aggregate({
      _sum: { amountPaid: true },
      where: { ...where, status: 'confirmed' },
    }),
    prisma.booking.count({ where: { ...where, status: 'confirmed', checkinDone: false } }),
    prisma.booking.findMany({
      where,
      distinct: ['userId'],
      select: { userId: true },
    }),
    prisma.booking.groupBy({
      by: ['agentId'],
      _count: true,
      where,
      orderBy: { _count: { agentId: 'desc' } },
    }),
  ]);

  return {
    tripId,
    totalBookings,
    totalConfirmed,
    totalCanceled,
    totalRevenue: totalRevenue._sum.amountPaid || 0,
    noShow,
    uniqueUsers: distinctUsers.length,
    noShowRate: totalConfirmed > 0 ? (noShow / totalConfirmed) * 100 : 0,
    topAgents: topAgents.map(a => ({
      agentId: a.agentId,
      count: a._count,
    })),
  };
}

export async function getPassengerBookings(userId: string) {
  return prisma.booking.findMany({
    where: { userId },
    include: {
      trip: {
        include: { route: true },
      },
    },
  });
}

export async function getAdminOverview() {
  const [tripCount, bookingCount, revenue, passengerCount, agentCount] = await Promise.all([
    prisma.trip.count(),
    prisma.booking.count(),
    prisma.payment.aggregate({ _sum: { amount: true } }),
    prisma.booking.count({ where: { status: "confirmed" } }),
    prisma.agent.count({ where: { isActive: true } }),
  ]);

  return {
    tripCount,
    bookingCount,
    totalRevenue: revenue._sum.amount || 0,
    passengerCount,
    activeAgents: agentCount,
  };
}

export async function getDashboardData(filters: { from?: string; to?: string }) {
  const whereBooking: any = {};
  if (filters.from || filters.to) {
    whereBooking.bookedAt = {};
    if (filters.from) whereBooking.bookedAt.gte = new Date(filters.from);
    if (filters.to) whereBooking.bookedAt.lte = new Date(filters.to);
  }

  // Total de viagens no período
  const tripCount = await prisma.trip.count();

  // Reservas no período
  const totalBookings = await prisma.booking.count({ where: whereBooking });

  // Reservas confirmadas no período
  const totalConfirmed = await prisma.booking.count({ 
    where: { ...whereBooking, status: 'confirmed' }
  });

  // Receita total confirmada no período
  const totalRevenueRaw = await prisma.booking.aggregate({
    _sum: { amountPaid: true },
    where: { ...whereBooking, status: 'confirmed' }
  });
  const totalRevenue = totalRevenueRaw._sum.amountPaid || 0;

  // Passageiros únicos no período
  const uniqueUsersRaw = await prisma.booking.findMany({
    where: whereBooking,
    distinct: ['userId'],
    select: { userId: true },
  });
  const uniqueUsers = uniqueUsersRaw.length;

  // No-shows: reservas confirmadas sem check-in
  const noShowCount = await prisma.booking.count({
    where: { ...whereBooking, status: 'confirmed', checkinDone: false }
  });
  const noShowRate = totalConfirmed > 0 ? (noShowCount / totalConfirmed) * 100 : 0;

  // Agentes ativos + ranking (número de reservas feitas)
  const topAgentsRaw = await prisma.booking.groupBy({
    by: ['agentId'],
    _count: { _all: true },
    where: whereBooking,
    orderBy: { _count: { agentId: 'desc' } },
    take: 5,
  });
  const topAgents = topAgentsRaw.map(agent => ({
    agentId: agent.agentId,
    bookingsCount: agent._count._all,
  }));

  // Alertas de checklists com problemas ativos (issuesFound não nulo)
  const problematicChecklistsCount = await prisma.tripChecklist.count({
    where: {
      issuesFound: { not: null }
    }
  });

  return {
    tripCount,
    totalBookings,
    totalConfirmed,
    totalRevenue,
    uniqueUsers,
    noShowCount,
    noShowRate,
    topAgents,
    problematicChecklistsCount,
  };
}