import express from 'express';
import router from './routes';
import { auditMiddleware } from './middlewares/auditMiddleware';
import { isAuthenticated } from './middlewares/authMiddleware';
import { apiLimiter } from './middlewares/rateLimiterMiddleware';
import { setupSwagger } from './docs/swagger';

import authRoutes from './routes/authRoutes';
import exportRoutes from './routes/exportRoutes';

const app = express();

app.use(express.json());

// 🔓 Public routes
app.use('/api/auth', authRoutes);
app.use('/api/exports', exportRoutes);

// 🔒 Middlewares protected
app.use('/api', isAuthenticated);        // verifica se o usuário está autenticado
app.use('/api', auditMiddleware);        // logs só de quem está autenticado
app.use('/api', apiLimiter);             // limitar chamadas autenticadas

// 🔐 Protected routes
app.use('/api', router);

// 📄 Docs
setupSwagger(app);

export default app;
