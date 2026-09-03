const fs = require("fs");
let p = "apps/web/src/app/[locale]/(public)/berita/page.tsx";
let c = fs.readFileSync(p, "utf8");

c = c.replace(
  "const t = await getTranslations('Home');",
  "const t = await getTranslations('Berita');"
);

c = c.replace(
  "breadcrumbText={t('artikel') || 'Berita'}",
  "breadcrumbText={t('metaTitle')}"
);

fs.writeFileSync(p, c, "utf8");
console.log("Berita namespace fixed");
