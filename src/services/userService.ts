import bcrypt from 'bcrypt';
import { PrismaClient, UserRole } from '@prisma/client';
const prisma = new PrismaClient();

async function createUser(data: { name: string; email: string; password: string }) {
  const passwordHash = await bcrypt.hash(data.password, 10); // saltRounds = 10

  return prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      passwordHash, // salva o hash, não a senha pura
      role: UserRole.passenger, // valor padrão conforme modelo
    },
  });
}

async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
  });
}

async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  });
}

async function updateUser(id: string, data: Partial<{
  name: string;
  phone: string;
  document: string;
  photoUrl: string;
  isActive: boolean;
}>) {
  return prisma.user.update({
    where: { id },
    data,
  });
}

async function listUsers() {
  return await prisma.user.findMany();
}

async function deleteUser(id: string) {
  return await prisma.user.delete({
    where: { id },
  });
}

export const userService = {
  createUser,
  getUserById,
  getUserByEmail,
  listUsers,
  updateUser,
  deleteUser,
};