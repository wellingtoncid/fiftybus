import { Router } from 'express';
import { exportAdminLogReport, exportAdminBookingReport } from '../controllers/exportController';

const router = Router();

router.get('/logs', exportAdminLogReport);
router.get('/reports', exportAdminBookingReport);

export default router;