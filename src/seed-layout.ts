import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Homepage layout structure - must be an ARRAY of section objects
  const layoutData = [
    { type: "Hero", id: "hero-main" },
    { type: "About", id: "about-section" }
  ];

  await prisma.content.upsert({
    where: { key: 'homepage_layout' },
    update: { value: JSON.stringify(layoutData) },
    create: { key: 'homepage_layout', value: JSON.stringify(layoutData) },
  });

  console.log('✅ Homepage layout seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
