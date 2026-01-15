import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const roles = [
    { name: 'ADMIN', description: 'System Administrator' },
    { name: 'USER', description: 'Regular User' },
    { name: 'CONTENT_MANAGER', description: 'Can manage website content' },
    { name: 'SALES', description: 'Can manage leads' },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: role,
    });
  }

  console.log('✅ Roles seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
