import { Request, Response } from 'express';
import { prisma } from '../lib/prisma'; 
import bcrypt from 'bcrypt';


async function createAgent(req: Request, res: Response) {
  try {
    const { name, email, password, region, commissionRate } = req.body;

    if (!name || !email || !password || !region || commissionRate == undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Cria o usuário com role agent
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: 'agent',
      },
    });

    // Cria o agent ligado ao usuário
    const agent = await prisma.agent.create({
      data: {
        userId: user.id,
        region,
        commissionRate,
        isActive: true,
      },
    });

    res.locals.entityId = agent.id;
    res.locals.metadata = { name: user.name };

    return res.status(201).json({ user, agent });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Email already exists' });
    }
    console.error('Erro ao criar agent:', error);
    return res.status(500).json({ error: 'Failed to create agent' });
  }
}
 
export default {
  createAgent,
};

