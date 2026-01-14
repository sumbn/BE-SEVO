"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const heroData = {
        title: "Làm chủ kỹ năng số -\nBứt phá sự nghiệp tương lai.",
        subtitle: "Hệ sinh thái đào tạo thực chiến: Lập trình, Ngoại ngữ & Sáng tạo nội dung. Trang bị tư duy, rèn luyện kỹ năng để tự tin gia nhập thị trường lao động toàn cầu.",
        ctas: [
            { label: "Tìm khóa học phù hợp →", link: "#courses", variant: "primary" },
            { label: "Xem video giới thiệu ▷", link: "#intro", variant: "outline" }
        ],
        showTrustBar: true,
        trustBarText: "Hơn 5.000 học viên đã tốt nghiệp | Đối tác tuyển dụng",
        trustBarLogos: [
            { src: "/logos/partner1.png", alt: "Nexus Logic" },
            { src: "/logos/partner2.png", alt: "Luminate Digital" },
            { src: "/logos/partner3.png", alt: "LearnForge" },
            { src: "/logos/partner4.png", alt: "Nexus Global" }
        ],
        showVisual: true,
        visualImages: [
            { src: '/hero-collage.png', alt: 'Hero Image 1' }
        ]
    };
    await prisma.content.upsert({
        where: { key: 'hero' },
        update: { value: JSON.stringify(heroData) },
        create: { key: 'hero', value: JSON.stringify(heroData) },
    });
    console.log('✅ Hero section seeded successfully');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed-hero.js.map