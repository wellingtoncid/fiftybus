import { Router } from 'express';
import { isAuthenticated } from '../middlewares/isAuthenticatedMiddleware';
import { hasRole } from '../middlewares/hasRoleMiddleware';

const router = Router();

router.get('/admin-only', isAuthenticated, hasRole('admin'), (req, res) => {
  res.json({ message: 'Você é um admin autenticado! 👑' });
});

export default router;