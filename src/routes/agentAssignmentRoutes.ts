import { Router } from 'express';
import {
  assignAgentToTrip,
  assignAgentToRoute,
  getAgentsByTrip,
  getAgentsByRoute,
  removeAgentFromTrip
} from '../controllers/agentAssignmentController';

const router = Router();

router.post('/assign/trip', assignAgentToTrip);
router.post('/assign/route', assignAgentToRoute);
router.get('/trip/:tripId', getAgentsByTrip);
router.get('/route/:routeId', getAgentsByRoute);
router.delete('/trip/:id', removeAgentFromTrip);

export default router;