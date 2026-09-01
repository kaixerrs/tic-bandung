const fs = require('fs');
const file = 'src/app/[locale]/(public)/pusat-bantuan/page.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(
  'export default async function PusatBantuanPage() {',
  "import { getTranslations } from 'next-intl/server';\n\nexport default async function PusatBantuanPage({ params }: { params: Promise<{ locale: string }> }) {"
);

c = c.replace(
  'const settings = await getSiteSettings();',
  "const settings = await getSiteSettings();\n  const { locale } = await params;\n  const t = await getTranslations({ locale, namespace: 'HelpCenter' });"
);

c = c.replace(
  '<h1 className="text-3xl md:text-5xl lg:text-6xl font-bold font-heading tracking-tight mb-6">\n                Pusat Bantuan\n              </h1>',
  '<h1 className="text-3xl md:text-5xl lg:text-6xl font-bold font-heading tracking-tight mb-6">\n                {t("title")}\n              </h1>'
);

c = c.replace(
  '<p className="text-lg md:text-xl text-white/90 leading-relaxed font-body-md max-w-2xl">\n                Temukan informasi penting, kontak darurat, dan jawaban atas pertanyaan umum terkait perjalanan Anda di Kota Bandung.\n              </p>',
  '<p className="text-lg md:text-xl text-white/90 leading-relaxed font-body-md max-w-2xl">\n                {t("subtitle")}\n              </p>'
);

c = c.replace(
  '<h2 className="text-xl md:text-2xl font-bold font-heading tracking-widest text-white/90 uppercase mb-8">\n              Kontak Darurat Resmi\n            </h2>',
  '<h2 className="text-xl md:text-2xl font-bold font-heading tracking-widest text-white/90 uppercase mb-8">\n              {t("emergencyContacts")}\n            </h2>'
);

fs.writeFileSync(file, c);
console.log('Translated PB page');
