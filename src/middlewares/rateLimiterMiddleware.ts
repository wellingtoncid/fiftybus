import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 100, // máx. 100 requisições por IP
  message: 'Muitas requisições – tente novamente em breve.',
});