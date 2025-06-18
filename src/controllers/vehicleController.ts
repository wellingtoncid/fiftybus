import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const vehicleController = {
  async createVehicle(req: Request, res: Response) {
    try {
      const data = req.body;
      const vehicle = await prisma.vehicle.create({ data });
      return res.status(201).json(vehicle);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to create vehicle' });
    }
  },

  async getVehicleById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const vehicle = await prisma.vehicle.findUnique({ where: { id } });
      if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });
      return res.json(vehicle);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to retrieve vehicle' });
    }
  },

  async listVehicles(req: Request, res: Response) {
    try {
      const vehicles = await prisma.vehicle.findMany();
      return res.json(vehicles);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to list vehicles' });
    }
  },

  async updateVehicle(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = req.body;
      const updated = await prisma.vehicle.update({
        where: { id },
        data,
      });
      return res.json(updated);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to update vehicle' });
    }
  },

  async deleteVehicle(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await prisma.vehicle.delete({ where: { id } });
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: 'Failed to delete vehicle' });
    }
  },
};

export default vehicleController;
