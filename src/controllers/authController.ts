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
    const data = registerSchema.parse(req.body);

    // Força o role para 'passenger' para registro público
    const user = await authService.register({ ...data, role: 'passenger' });

    return res.status(201).json(user);
  } catch (error: any) {
    if (error.name === "ZodError") {
      return res.status(400).json({ error: error.errors });
    }

    console.error("Erro no register:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};

// Novo endpoint para criação interna de usuários (admin, manager, agent)
export const createUser = async (req: Request, res: Response) => {
  try {
    const data = req.body;

    // Aqui pressupõe que o middleware auth populou req.user com id e role
    const createdBy = req.user;

    if (!createdBy) {
      return res.status(401).json({ error: "Usuário não autenticado" });
    }

    // Valida o dado mínimo antes (opcional, pode usar Zod aqui)
    if (!data.name || !data.email || !data.password || !data.role) {
      return res.status(400).json({ error: "Dados incompletos" });
    }

    const user = await authService.createUser({
      ...data,
      createdBy: { id: createdBy.id, role: createdBy.role },
    });

    return res.status(201).json(user);
  } catch (error: any) {
    console.error("Erro ao criar usuário:", error);
    if (error.message.includes("Permissão negada")) {
      return res.status(403).json({ error: error.message });
    }
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};