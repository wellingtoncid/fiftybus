import { Router } from 'express';
import auditLogRoutes from './auditLogRoutes';
import adminReportRoutes from './adminReportRoutes';
import { getDashboard } from '../controllers/adminReportController';

const router = Router();

// Audit logs em /admin/audit-logs
router.use('/audit-logs', auditLogRoutes);

// Relatórios administrativos em /admin/reports
router.use('/reports', adminReportRoutes);

// Dashboard direto em /admin/dashboard
router.get('/dashboard', getDashboard);

export default router;