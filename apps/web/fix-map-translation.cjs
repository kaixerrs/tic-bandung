const fs = require("fs");
let p = "src/components/public/DestinationMap.tsx";
let c = fs.readFileSync(p, "utf8");

c = c.replace("import { useTranslations } from 'next-intl';", "import { useTranslations, useLocale } from 'next-intl';");
c = c.replace("const t = useTranslations('Components');", "const t = useTranslations('Components');\n  const locale = useLocale();");
c = c.replace(/>\{t\('loadingMap'\)\}</g, ">{locale === 'en' ? 'Loading map...' : 'Memuat peta...'}<");

fs.writeFileSync(p, c, "utf8");
console.log("Map translation bypassed");
