import { Router } from 'express';
import { exportAuditLogs } from '../controllers/auditLogController';
import { isAuthenticated } from '../middlewares/authMiddleware';
import { hasRole } from '../middlewares/hasRoleMiddleware';

const router = Router();

router.get('/logs/export', isAuthenticated, hasRole('admin'), exportAuditLogs);

export default router;