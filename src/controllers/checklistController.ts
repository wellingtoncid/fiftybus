import { Request, Response } from 'express';
import { tripChecklistService } from '../services/checklistService';
import { ChecklistType, Prisma } from '@prisma/client';

export async function createStartChecklist(req: Request, res: Response) {
  try {
    const data = { ...req.body, type: ChecklistType.start };
    const checklist = await tripChecklistService.createChecklist(data);

    res.locals.entityId = checklist.id;
    res.locals.metadata = {
      tripId: checklist.tripId,
      driverId: checklist.driverId,
      vehicleId: checklist.vehicleId
    };

    res.status(201).json(checklist);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return res.status(409).json({
        error: "Checklist of type 'start' already exists for this trip.",
      });
    }

    console.error('Erro ao criar checklist inicial:', error);
    res.status(500).json({ error: 'Erro ao criar checklist inicial' });
  }
}

export async function createEndChecklist(req: Request, res: Response) {
  try {
    const data = { ...req.body, type: ChecklistType.end };
    const checklist = await tripChecklistService.createChecklist(data);

    res.locals.entityId = checklist.id;
    res.locals.metadata = {
      tripId: checklist.tripId,
      driverId: checklist.driverId,
      vehicleId: checklist.vehicleId
    };

    res.status(201).json(checklist);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return res.status(409).json({
        error: "Checklist of type 'end' already exists for this trip.",
      });
    }

    console.error('Erro ao criar checklist final:', error);
    res.status(500).json({ error: 'Erro ao criar checklist final' });
  }
}

export async function getChecklistByTrip(req: Request, res: Response) {
  try {
    const { tripId } = req.params;
    const checklists = await tripChecklistService.getChecklistsByTrip(tripId);
    res.json(checklists);
  } catch (error) {
    console.error('Erro ao obter checklists da viagem:', error);
    res.status(500).json({ error: 'Erro ao obter checklists' });
  }
}

export async function getProblematicChecklists(req: Request, res: Response) {
  try {
    const results = await tripChecklistService.getProblematicChecklists();
    res.json(results);
  } catch (error) {
    console.error('Erro ao buscar checklists com problemas:', error);
    res.status(500).json({ error: 'Erro ao buscar checklists com problemas' });
  }
}
