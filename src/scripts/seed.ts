import { PrismaClient, UserRole, VehicleStatus, TripStatus, BookingStatus, PaymentMethod, PaymentGateway, PaymentStatus } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Usuários
  const passwordHash = await bcrypt.hash('senha123', 10);
  const passenger = await prisma.user.create({
    data: {
      name: 'Maria Passageira',
      email: 'maria@teste.com',
      passwordHash,
      role: UserRole.passenger,
      isActive: true,
    },
  });
  const driver = await prisma.user.create({
    data: {
      name: 'João Motorista',
      email: 'joao@teste.com',
      passwordHash,
      role: UserRole.driver,
      isActive: true,
    },
  });

  // Veículo
  const vehicle = await prisma.vehicle.create({
    data: {
      model: 'Van',
      brand: 'Mercedes',
      totalSeats: 15,
      plate: 'ABC-1234',
      capacity: 15,
      year: 2020,
      status: VehicleStatus.active,
      mileage: 10000,
      driverId: driver.id,
    },
  });

  // Rota
  const route = await prisma.route.create({
    data: {
      origin: 'São Paulo',
      destination: 'Campinas',
      estimatedTime: '2h',
      distanceKm: 100,
      basePrice: 50,
      minPassengers: 5,
      isActive: true,
    },
  });

  // Viagem
  const trip = await prisma.trip.create({
    data: {
      routeId: route.id,
      vehicleId: vehicle.id,
      departureDate: new Date('2025-07-01'),
      departureTime: '08:00',
      status: TripStatus.open,
      minQuota: 5,
      estimatedCost: 250,
      currentBookings: 0,
      quorumReached: false,
    },
  });

  // Reserva
  const booking = await prisma.booking.create({
    data: {
      tripId: trip.id,
      userId: passenger.id,
      status: BookingStatus.confirmed,
      amountPaid: 250,
      paymentMethod: PaymentMethod.pix,
      bookedAt: new Date(),
      checkinDone: false,
    },
  });

  // Pagamento
  await prisma.payment.create({
    data: {
      bookingId: booking.id,
      gateway: PaymentGateway.mercadopago,
      status: PaymentStatus.approved,
      amount: 250,
      paidAt: new Date(),
      transactionId: 'txn_123456',
    },
  });

  console.log('Seed finalizado!');
}

main()
  .catch(e => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });