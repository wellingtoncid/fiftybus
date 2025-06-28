import { Router } from 'express';
import * as reportController from '../controllers/reportController';

const router = Router();

console.log('Report routes loaded');
router.post('/reports', reportController.createReport);
router.get('/reports/:id', reportController.getReportById);
router.get('/reports', reportController.listReports);
router.put('/reports/:id', reportController.updateReport);
router.delete('/reports/:id', reportController.deleteReport);
router.get('/sales-summary', reportController.salesSummary);


export default router;
