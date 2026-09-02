const fs = require("fs");
let p = "src/components/public/CategoryListingUI.tsx";
let c = fs.readFileSync(p, "utf8");

c = c.replace("import { useTranslations } from 'next-intl';", "import { useTranslations, useLocale } from 'next-intl';");
c = c.replace("const tc = useTranslations('CategoryUI');", "const tc = useTranslations('CategoryUI');\n  const locale = useLocale();");

c = c.replace(/>\{tc\('home'\)\}</g, ">{locale === 'en' ? 'Home' : 'Beranda'}<");
c = c.replace(/>\{tc\('category'\)\}</g, ">{locale === 'en' ? 'Category' : 'Kategori'}<");

fs.writeFileSync(p, c, "utf8");
console.log("Category translation bypassed");
