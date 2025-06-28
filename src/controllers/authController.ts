import { Request, Response } from 'express';
import { authService } from '../services/authService';

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.json(result);
  } catch {
    res.status(401).json({ error: 'Credenciais inválidas' });
  }
}

export async function register(req: Request, res: Response) {
  try {
    const user = await authService.register(req.body);
    res.status(201).json(user);
  } catch (e) {
    res.status(400).json({ error: 'Erro ao registrar usuário' });
  }
}