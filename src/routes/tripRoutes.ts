import { Router } from "express";
import tripController from "../controllers/tripController";
import { auditLog } from '../middlewares/auditMiddleware';

const router = Router();

router.post('/trips', auditLog('create', 'Trip'), tripController.createTrip);
router.get('/trips', auditLog('update', 'Trip'), tripController.listTrips);
router.put('/trips/:id', auditLog('update', 'Trip'), tripController.updateTrip);
router.delete('/trips/:id', auditLog('delete', 'Trip'), tripController.deleteTrip);

export default router;