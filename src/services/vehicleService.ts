import { PrismaClient, VehicleStatus } from '@prisma/client';

const prisma = new PrismaClient();

export const vehicleService = {
  async createVehicle(data: {
    plate: string;
    model: string;
    brand: string;
    totalSeats: number;
    capacity: number;
    year: number;
    status: VehicleStatus;
    mileage: number;
    driver: { connect: { id: string } };
  }) {
    return prisma.vehicle.create({ data });
  },
  
  async getVehicleById(id: string) {
    return prisma.vehicle.findUnique({ where: { id } });
  },

  async listVehicles() {
    return prisma.vehicle.findMany();
  },

  async updateVehicle(id: string, data: Partial<{
    plate: string;
    model: string;
    brand: string;
    totalSeats: number;
  }>) {
    return prisma.vehicle.update({
      where: { id },
      data,
    });
  },

  async deleteVehicle(id: string) {
    return prisma.vehicle.delete({ where: { id } });
  },
};

export default vehicleService;