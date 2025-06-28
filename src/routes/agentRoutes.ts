import { Router } from 'express';
import agentController from '../controllers/agentController';
import { auditLog } from '../middlewares/auditMiddleware';

const router = Router();

router.post('/', auditLog('create', 'agent'), agentController.createAgent);


export default router;