import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@fiftybus.com';

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    console.log(`⚠️ Admin já existe com o e-mail: ${email}`);
    return;
  }

  const hashed = await bcrypt.hash('Sucesso.10', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'Admin FiftyBus',
      email,
      passwordHash: hashed,
      role: 'admin',
    },
  });

  console.log(`✅ Admin criado com sucesso: ${admin.email}`);
}

main()
  .catch((e) => {
    console.error('❌ Erro ao criar admin:', e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
