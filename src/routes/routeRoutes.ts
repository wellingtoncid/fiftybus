import { Router } from "express";
import * as routeController from '../controllers/routeController';
import { auditLog } from '../middlewares/auditMiddleware';

const router = Router();

router.post('/routes', auditLog('create', 'route'), routeController.createRoute);
router.get('/routes/:id', routeController.getRouteById);
router.put('/routes/:id', auditLog('update', 'route'), routeController.updateRoute);

export default router; 