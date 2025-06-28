import { Router } from 'express';
import * as checklistController from '../controllers/checklistController';
import { auditLog } from '../middlewares/auditMiddleware';

const router = Router();

router.post('/start', auditLog('create', 'TripChecklist'), checklistController.createStartChecklist);
router.post('/end', auditLog('create', 'TripChecklist'), checklistController.createEndChecklist);
router.get('/:tripId', checklistController.getChecklistByTrip);
router.get('/problems/list', checklistController.getProblematicChecklists);

export default router;
