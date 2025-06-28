import { prisma } from '../lib/prisma';
import { createObjectCsvWriter } from 'csv-writer';
import path from 'path';

export async function exportAuditLogsReport(): Promise<string> {
  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const filePath = path.join(__dirname, '../../exports/logs/auditlogs.csv');

  const csvWriter = createObjectCsvWriter({
    path: filePath,
    header: [
      { id: 'id', title: 'ID' },
      { id: 'userId', title: 'User ID' },
      { id: 'action', title: 'Action' },
      { id: 'entity', title: 'Entity' },
      { id: 'entityId', title: 'Entity ID' },
      { id: 'metadata', title: 'Metadata' },
      { id: 'timestamp', title: 'Timestamp' },
    ],
  });

  await csvWriter.writeRecords(
    logs.map(log => ({
      ...log,
      metadata: log.metadata ? JSON.stringify(log.metadata) : '',
    }))
  );

  return filePath;
}

export async function exportBookingsReport(): Promise<string> {
  const bookings = await prisma.booking.findMany({
    include: {
      trip: { include: { route: true } },
      user: true,
      agent: { include: { user: true } },
    },
  });

  const filePath = path.join(__dirname, '../../exports/reports/bookings.csv');

  const csvWriter = createObjectCsvWriter({
    path: filePath,
    header: [
      { id: 'id', title: 'ID' },
      { id: 'userName', title: 'Passenger' },
      { id: 'tripId', title: 'Trip ID' },
      { id: 'routeName', title: 'Route' },
      { id: 'amountPaid', title: 'Amount Paid' },
      { id: 'status', title: 'Status' },
      { id: 'checkinDone', title: 'Check-In Done' },
      { id: 'agentName', title: 'Agent' },
      { id: 'bookedAt', title: 'Booked At' },
    ],
  });

  await csvWriter.writeRecords(
    bookings.map(b => ({
      id: b.id,
      userName: b.user?.name || '-',
      tripId: b.tripId,
      routeName: b.trip?.route ? `${b.trip.route.origin} - ${b.trip.route.destination}` : '-',
      amountPaid: b.amountPaid,
      status: b.status,
      checkinDone: b.checkinDone ? 'Yes' : 'No',
      agentName: b.agent?.user?.name || '-',
      bookedAt: b.bookedAt.toISOString(),
    }))
  );

  return filePath;
}
