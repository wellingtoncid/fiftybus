import { Request, Response } from 'express';
import * as service from '../services/agentAssignmentService';

export async function assignAgentToTrip(req: Request, res: Response) {
  try {
    const { agentId, tripId } = req.body;
    const result = await service.assignAgentToTrip(agentId, tripId);
    res.locals.entityId = tripId;
    res.locals.metadata = { agentId };
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: 'Failed to assign agent to trip' });
  }
}


export async function assignAgentToRoute(req: Request, res: Response) {
  try {
    const { agentId, routeId } = req.body;
    const result = await service.assignAgentToRoute(agentId, routeId);
    res.locals.entityId = routeId;
    res.locals.metadata = { agentId };
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: 'Failed to assign agent to route' });
  }
}

export async function getAgentsByTrip(req: Request, res: Response) {
  try {
    const { tripId } = req.params;
    const agents = await service.getAgentsByTrip(tripId);
    res.json(agents);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar agentes da viagem' });
  }
}

export async function getAgentsByRoute(req: Request, res: Response) {
  try {
    const { routeId } = req.params;
    const agents = await service.getAgentsByRoute(routeId);
    res.json(agents);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar agentes da rota' });
  }
}

export async function removeAgentFromTrip(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const result = await service.removeAgentFromTrip(id);
    res.locals.entityId = id;
    res.locals.metadata = { id };
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao remover agente da viagem' });
  }
}

