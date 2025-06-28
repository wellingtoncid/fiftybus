import { Request, Response } from 'express';
import { vehicleService } from '../services/vehicleService';

export const vehicleController = {
  async createVehicle(req: Request, res: Response) {
  try {
    const vehicle = await vehicleService.createVehicle(req.body);
    res.locals.entityId = vehicle.id;
    res.locals.metadata = { plate: vehicle.plate };
    res.status(201).json(vehicle);
  } catch (err) {
    console.error("🚨 Erro ao criar veículo:", err); 
    res.status(400).json({ error: "Failed to create vehicle", details: err });
  }
},

  async getVehicleById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const vehicle = await vehicleService.getVehicleById(id);
      if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });
      res.json(vehicle);
    } catch (err) {
      res.status(500).json({ error: 'Failed to get vehicle', details: err });
    }
  },

  async listVehicles(req: Request, res: Response) {
    try {
      const vehicles = await vehicleService.listVehicles();
      res.json(vehicles);
    } catch (err) {
      res.status(500).json({ error: 'Failed to list vehicles', details: err });
    }
  },

  async updateVehicle(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const vehicle = await vehicleService.updateVehicle(id, req.body);
      res.locals.entityId = req.params.id;
      res.locals.metadata = { updatedFields: Object.keys(req.body) };
      res.json(vehicle);
    } catch (err) {
      res.status(400).json({ error: 'Failed to update vehicle', details: err });
    }
  },

  async deleteVehicle(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await vehicleService.deleteVehicle(id);
      res.locals.entityId = id;
      res.locals.metadata = { action: 'delete' };
      res.status(204).send();
    } catch (err) {
      res.status(400).json({ error: 'Failed to delete vehicle', details: err });
    }
  },
};
