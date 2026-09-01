const fs = require('fs');
const file = 'src/app/[locale]/(public)/pusat-bantuan/page.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(
  "export default async function PusatBantuanPage() {",
  "import { getTranslations } from 'next-intl/server';\n\nexport default async function PusatBantuanPage() {"
);

c = c.replace(
  "const settings = await getSiteSettings();",
  "const settings = await getSiteSettings();\n  const t = await getTranslations('HelpCenter');"
);

c = c.replace(
  '<h1 className="text-3xl md:text-5xl lg:text-6xl font-bold font-heading tracking-tight mb-6">',
  '<h1 className="text-3xl md:text-5xl lg:text-6xl font-bold font-heading tracking-tight mb-6">\n              {t("title")}'
);

c = c.replace(
  'Pusat Bantuan',
  '' // wait, replacing "Pusat Bantuan" text node is dangerous. Let's do it specifically.
);
