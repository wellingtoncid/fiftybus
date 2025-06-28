import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { userService } from '../services/userService';

const prisma = new PrismaClient();

const userController = {
  async createUser(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;

      if (!password) {
        return res.status(400).json({ error: 'Password is required' });
      }
      
      const user = await userService.createUser({ name, email, password });
      res.locals.entityId = user.id;
      res.locals.metadata = { name: user.name, email: user.email };
      res.status(201).json(user);
    } catch (err) {
      res.status(400).json({ error: "Failed to create user", details: err });
    }
  },

  async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await prisma.user.findUnique({ where: { id } });
      if (!user) return res.status(404).json({ error: 'User not found' });
      return res.json(user);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to get user' });
    }
  },

  async listUsers(req: Request, res: Response) {
    try {
      const users = await prisma.user.findMany();
      return res.json(users);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to list users' });
    }
  },

  async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = req.body;
      const updatedUser = await prisma.user.update({
        where: { id },
        data,
      });
      res.locals.entityId = req.params.id;
      res.locals.metadata = { updatedFields: Object.keys(req.body) };
      return res.json(updatedUser);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to update user' });
    }
  },

  async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await prisma.user.delete({ where: { id } });
      res.locals.entityId = req.params.id; 
      res.locals.metadata = { action: 'delete' };
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: 'Failed to delete user' });
    }
  },
};

export default userController;
