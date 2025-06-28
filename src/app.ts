import express from 'express';
import router from './routes';
import { auditMiddleware } from './middlewares/auditMiddleware';
import { isAuthenticated } from './middlewares/authMiddleware';
import { apiLimiter } from './middlewares/rateLimiterMiddleware';
import { setupSwagger } from './docs/swagger';

const app = express();

app.use(express.json());
app.use('/api', router);
app.use(isAuthenticated); // já protege todas as rotas abaixo
app.use(auditMiddleware); // salva todos os acessos autenticados
app.use('/api', apiLimiter);

setupSwagger(app);

export default app;