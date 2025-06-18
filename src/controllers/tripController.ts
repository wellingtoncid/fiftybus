import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const tripController = {
  async createTrip(req: Request, res: Response) {
    try {
      const data = req.body;
      const trip = await prisma.trip.create({ data });
      return res.status(201).json(trip);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to create trip' });
    }
  },

  async getTripById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const trip = await prisma.trip.findUnique({ where: { id } });
      if (!trip) return res.status(404).json({ error: 'Trip not found' });
      return res.json(trip);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to get trip' });
    }
  },

  async listTrips(req: Request, res: Response) {
    try {
      const trips = await prisma.trip.findMany();
      return res.json(trips);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to list trips' });
    }
  },

  async updateTrip(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = req.body;
      const updatedTrip = await prisma.trip.update({
        where: { id },
        data,
      });
      return res.json(updatedTrip);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to update trip' });
    }
  },

  async deleteTrip(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await prisma.trip.delete({ where: { id } });
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: 'Failed to delete trip' });
    }
  },
};

export default tripController;
