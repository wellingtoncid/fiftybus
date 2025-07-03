import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';
import { UserRole } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET || 'jLDsRTHkyUTtNMJXqqdui4wpgaD8taqO8vJhQ/UVad4=';

export const authService = {
  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error('Invalid credentials');

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new Error('Invalid credentials');

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '2h' });

    return { token, user };
  },

  async register(data: { name: string; email: string; password: string; role?: string }) {
    const hashed = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash: hashed,
        role: Object.values(UserRole).includes(data.role as UserRole)
          ? (data.role as UserRole)
          : 'passenger',
      },
    });

    return user;
  },

  async createUser(data: {
    name: string;
    email: string;
    password: string;
    role: string;
    createdBy: { id: string; role: string };
  }) {
    const { createdBy } = data;

    // permission roles
    const allowedRoles = {
      admin: ["admin", "manager", "agent", "driver", "passenger"],
      manager: ["agent", "driver", "passenger"],
      agent: ["passenger"],
    };

    type RoleKey = keyof typeof allowedRoles;

    const permitted = allowedRoles[(createdBy.role as RoleKey)]?.includes(data.role);

    if (!permitted) {
      throw new Error("Permissão negada para criar esse tipo de usuário");
    }

    const hashed = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash: hashed,
        role: (data.role as UserRole) || 'passenger',
      },
    });

    return user;
  },

  verifyToken(token: string) {
    return jwt.verify(token, JWT_SECRET);
  }

};