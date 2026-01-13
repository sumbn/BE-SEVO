"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const globalConfig = {
        site_name: "SEVO Education Center",
        site_description: "Học lập trình cốt lõi - Kiến tạo tương lai số",
        logo_text: "SEVO",
        contact_info: [
            { label: "Email", value: "contact@sevo.edu.vn", icon: "envelope" },
            { label: "Hotline", value: "0912 345 678", icon: "phone" },
            { label: "Địa chỉ", value: "123 Đường Công Nghệ, Quận 1, TP. HCM", icon: "map-marker" }
        ]
    };
    await prisma.content.upsert({
        where: { key: 'global' },
        update: { value: JSON.stringify(globalConfig) },
        create: { key: 'global', value: JSON.stringify(globalConfig) },
    });
    console.log('✅ Global info seeded successfully with UTF-8 encoding');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed-global.js.map