import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const globalConfig = {
    site_name: "SEVO Education Center",
    site_description: "Học lập trình cốt lõi - Kiến tạo tương lai số",
    logo_text: "SEVO",
    contact_info: [
      { label: "Email", value: "contact@sevo.edu.vn", icon: "envelope" },
      { label: "Hotline", value: "0912 345 678", icon: "phone" },
      { label: "Địa chỉ", value: "123 Đường Công Nghệ, Quận 1, TP. HCM", icon: "map-marker" }
    ],
    nav_menu: [
      {
        label: "ĐÀO TẠO",
        type: "dropdown",
        items: [
          { label: "Lập trình chuyên sâu", sublabel: "Từ Zero đến Hero", href: "/courses/dev", color: "neon-blue" },
          { label: "Ngoại ngữ công nghệ", sublabel: "IELTS & Giao tiếp IT", href: "/courses/lang", color: "neon-pink" },
          { label: "Lịch khai giảng", href: "/schedule", icon: "calendar" }
        ]
      },
      {
        label: "DỊCH VỤ PHẦN MỀM",
        type: "dropdown",
        items: [
          { label: "Giải pháp Web/App", sublabel: "Custom Development", href: "/services/web-app" },
          { label: "Chuyển đổi số", sublabel: "Automation & Cloud", href: "/services/digital-transformation" },
          { label: "Tư vấn công nghệ", sublabel: "Architecture & Strategy", href: "/services/consulting" }
        ]
      },
      { label: "Về SEVO", href: "/about" },
      { label: "Blog", href: "/blog" }
    ],
    nav_ctas: [
      { label: "Học viên", href: "/admin/login", variant: "glass", icon: "user" },
      { label: "Tư vấn Dự án", href: "#contact", variant: "primary" }
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

