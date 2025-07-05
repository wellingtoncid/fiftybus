import express from 'express';
import cors from "cors"
import router from './routes';
import { auditMiddleware } from './middlewares/auditMiddleware';
import { isAuthenticated } from './middlewares/authMiddleware';
import { apiLimiter } from './middlewares/rateLimiterMiddleware';
import { setupSwagger } from './docs/swagger';
import userRoutes from './routes/userRoutes';

import authRoutes from './routes/authRoutes';
import exportRoutes from './routes/exportRoutes';


const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000", "https://fiftybus.vercel.app"],
    credentials: true,
  })
)

app.use(express.json());

// 🔓 Public routes
app.use('/api/auth', authRoutes);
app.use('/api/exports', exportRoutes);
app.use('/api/users', isAuthenticated, auditMiddleware, userRoutes);

// 🔒 Middlewares protected
app.use('/api', isAuthenticated);        // verifica se o usuário está autenticado
app.use('/api', auditMiddleware);        // logs só de quem está autenticado
app.use('/api', apiLimiter);             // limitar chamadas autenticadas

// 🔐 Protected routes
app.use('/api', router);

// 🛠️ Health check route
app.get('/health', (_req, res) => res.send('OK'));

// 📄 Docs
setupSwagger(app);

export default app;
