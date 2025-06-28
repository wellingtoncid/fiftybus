import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { tripService } from '../services/tripService';
import { createTripSchema } from "../schemas/tripSchemas";

const prisma = new PrismaClient();

const tripController = {
  async createTrip(req: Request, res: Response) {
    try {
      const validatedData = createTripSchema.parse(req.body);
      const trip = await tripService.createTrip(validatedData);
      res.locals.entityId = trip.id;
      res.locals.metadata = { routeId: trip.routeId };
      res.status(201).json(trip);
    } catch (err: any) {
    console.error(err); 
    if (err.name === "ZodError") {
      return res.status(400).json({ error: "Invalid input", details: err.errors });
    }
    return res.status(500).json({ error: "Failed to create trip", details: err.message});
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
    const trips = await tripService.listTrips();
    res.json(trips);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch trips' });
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
      res.locals.entityId = req.params.id;
      res.locals.metadata = { updatedFields: Object.keys(req.body) };
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
