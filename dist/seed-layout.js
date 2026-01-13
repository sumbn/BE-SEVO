"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
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
//# sourceMappingURL=seed-layout.js.map