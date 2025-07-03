import { Request, Response } from 'express';
import { authService } from '../services/authService';
import { registerSchema } from "../schemas/authSchema";

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.json(result);
  } catch {
    res.status(401).json({ error: 'Credenciais inválidas' });
  }
}

export const register = async (req: Request, res: Response) => {
  try {
    const data = registerSchema.parse(req.body); // validação aqui
    const user = await authService.register(data);
    return res.status(201).json(user);
  } catch (error: any) {
    if (error.name === "ZodError") {
      return res.status(400).json({ error: error.errors });
    }

    console.error("Erro no register:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};