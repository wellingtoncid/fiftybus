import { Request, Response } from 'express';
import * as routeService from '../services/routeService';

export async function createRoute(req: Request, res: Response) {
  try {
    const route = await routeService.createRoute(req.body);
    res.locals.entityId = route.id;
    res.locals.metadata = { name: route.destination };
    res.status(201).json(route);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create route' });
  }
}

export async function getRouteById(req: Request, res: Response) {
  try {
    const route = await routeService.getRouteById(req.params.id);
    if (!route) return res.status(404).json({ error: 'Route not found' });
    res.json(route);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get route' });
  }
}

export async function updateRoute(req: Request, res: Response) {
  try {
    const updatedRoute = await routeService.updateRoute(req.params.id, req.body);
    if (!updatedRoute) return res.status(404).json({ error: 'Route not found' });
    res.locals.entityId = req.params.id;
    res.locals.metadata = { updatedFields: Object.keys(req.body) };
    res.json(updatedRoute);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update route' });
  }
}

