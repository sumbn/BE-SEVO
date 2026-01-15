
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const contentVi = {
  "site_name": "SEVO Education Center",
  "site_description": "Học lập trình cốt lõi - Kiến tạo tương lai số",
  "logo_text": "SEVO",
  "contact_info": [
    { "label": "Email", "value": "contact@sevo.edu.vn", "icon": "envelope" },
    { "label": "Hotline", "value": "0912 345 678", "icon": "phone" },
    { "label": "Địa chỉ", "value": "123 Đường Công Nghệ, Quận 1, TP. HCM", "icon": "map-marker" }
  ],
  "nav_menu": [
    {
      "label": "ĐÀO TẠO",
      "type": "dropdown",
      "items": [
        { "label": "Lập trình chuyên sâu", "sublabel": "Từ Zero đến Hero", "href": "/courses/dev", "color": "neon-blue" },
        { "label": "Ngoại ngữ công nghệ", "sublabel": "IELTS & Giao tiếp IT", "href": "/courses/lang", "color": "neon-pink" },
        { "label": "Lịch khai giảng", "href": "/schedule", "icon": "calendar" }
      ]
    },
    {
      "label": "DỊCH VỤ PHẦN MỀM",
      "type": "dropdown",
      "items": [
        { "label": "Giải pháp Web/App", "sublabel": "Custom Development", "href": "/services/web-app" },
        { "label": "Chuyển đổi số", "sublabel": "Automation & Cloud", "href": "/services/digital-transformation" },
        { "label": "Tư vấn công nghệ", "sublabel": "Architecture & Strategy", "href": "/services/consulting" }
      ]
    },
    { "label": "Về SEVO", "href": "/about" },
    { "label": "Blog", "href": "/blog" }
  ],
  "nav_ctas": [
    { "label": "Học viên", "href": "/admin/login", "variant": "glass", "icon": "user" },
    { "label": "Tư vấn Dự án", "href": "#contact", "variant": "primary" }
  ]
};

const contentEn = {
  "site_name": "SEVO Education Center",
  "site_description": "Core Programming - Architecting Digital Future",
  "logo_text": "SEVO",
  "contact_info": [
    { "label": "Email", "value": "contact@sevo.edu.vn", "icon": "envelope" },
    { "label": "Hotline", "value": "0912 345 678", "icon": "phone" },
    { "label": "Address", "value": "123 Tech Street, District 1, HCMC", "icon": "map-marker" }
  ],
  "nav_menu": [
    {
      "label": "EDUCATION",
      "type": "dropdown",
      "items": [
        { "label": "Advanced Programming", "sublabel": "From Zero to Hero", "href": "/courses/dev", "color": "neon-blue" },
        { "label": "Tech English", "sublabel": "IELTS & IT Communication", "href": "/courses/lang", "color": "neon-pink" },
        { "label": "Opening Schedule", "href": "/schedule", "icon": "calendar" }
      ]
    },
    {
      "label": "SOFTWARE SERVICES",
      "type": "dropdown",
      "items": [
        { "label": "Web/App Solutions", "sublabel": "Custom Development", "href": "/services/web-app" },
        { "label": "Digital Transformation", "sublabel": "Automation & Cloud", "href": "/services/digital-transformation" },
        { "label": "Tech Consulting", "sublabel": "Architecture & Strategy", "href": "/services/consulting" }
      ]
    },
    { "label": "About SEVO", "href": "/about" },
    { "label": "Blog", "href": "/blog" }
  ],
  "nav_ctas": [
    { "label": "Student", "href": "/admin/login", "variant": "glass", "icon": "user" },
    { "label": "Project Consultation", "href": "#contact", "variant": "primary" }
  ]
};

async function main() {
  const key = 'global';
  
  console.log(`Updating content for key: ${key}...`);

  const exists = await prisma.content.findUnique({ where: { key } });

  const value = {
    vi: contentVi,
    en: contentEn
  };

  const result = await prisma.content.upsert({
    where: { key },
    create: {
      key,
      value: value,
    },
    update: {
      value: value,
    }
  });

  console.log('Update successful!');
  console.log('New Value Preview:', JSON.stringify(result.value, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
