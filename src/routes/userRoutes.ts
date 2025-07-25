import { Router } from 'express';
import userController from '../controllers/userController';
import { auditLog } from '../middlewares/auditMiddleware';
import { isAuthenticated, hasRole } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', userController.listUsers);
//router.post('/users', auditLog('create', 'User'), userController.createUser);
router.post('/users', auditLog('create', 'User'), isAuthenticated, hasRole('admin', 'manager', 'agent'), userController.createUser);
router.put('/users/:id', auditLog('update', 'User'), userController.updateUser);
router.delete('/users/:id', auditLog('delete', 'User'), userController.deleteUser);

export default router;