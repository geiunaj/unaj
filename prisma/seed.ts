// prisma/seed.ts

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  // Crear un tipo de usuario
  const adminType = await prisma.typeUser.create({
    data: {
      type_name: 'admin',
    },
  });

  // Crear un usuario con el tipo de usuario creado
  const hashedPassword = await bcrypt.hash('password123', 10);
  const user = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      telefono: '123456789',
      password: hashedPassword,
      type_user_id: adminType.id,
    },
  });

  console.log({ adminType, user });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
