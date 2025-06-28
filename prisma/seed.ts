import { prisma } from '../src/lib/prisma';
import { hashSync } from 'bcryptjs';

async function main() {
  await prisma.auditLog.deleteMany();
  await prisma.agent.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.review.deleteMany();
  await prisma.tripChecklist.deleteMany();
  await prisma.trip.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.route.deleteMany();
  await prisma.user.deleteMany();

  const admin = await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'admin@fiftybus.com',
      passwordHash: hashSync('admin123', 10),
      role: 'admin',
    },
  });

  const driver = await prisma.user.create({
    data: {
      name: 'Driver',
      email: 'driver@fiftybus.com',
      passwordHash: hashSync('driver123', 10),
      role: 'driver',
    },
  });

  const passenger = await prisma.user.create({
    data: {
      name: 'Passenger',
      email: 'passenger@fiftybus.com',
      passwordHash: hashSync('pass123', 10),
      role: 'passenger',
    },
  });

  const vehicle = await prisma.vehicle.create({
    data: {
      plate: 'ABC-1234',
      model: 'Ônibus A1',
      brand: 'Mercedes-Benz',
      capacity: 40,
      totalSeats: 40,
      year: 2022,
      status: 'active',
      mileage: 50000,
      driverId: driver.id,
    },
  });

  const route = await prisma.route.create({
    data: {
      origin: 'Cidade A',
      destination: 'Cidade B',
      distanceKm: 100,
      estimatedTime: '120',
      basePrice: 50,
      minPassengers: 1,
    },
  });

  const trip = await prisma.trip.create({
    data: {
      routeId: route.id,
      vehicleId: vehicle.id,
      departureTime: new Date(),
      departureDate: new Date('2025-06-28'),
      status: 'open',
      minQuota: 1,
      estimatedCost: 100,
    },
  });

  const agentUser = await prisma.user.create({
    data: {
      name: 'Agente',
      email: 'agent@fiftybus.com',
      passwordHash: hashSync('agent123', 10),
      role: 'agent',
    },
  });

  await prisma.agent.create({
    data: {
      userId: agentUser.id,
      isActive: true,
      region: 'Centro', // Provide a valid region value
      commissionRate: 0.1, // Provide a valid commission rate (e.g., 10%)
    },
  });
}

main()
  .then(() => {
    console.log('🌱 Seed finalizado com sucesso.');
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
