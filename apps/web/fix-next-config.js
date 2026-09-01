const fs = require('fs');
const file = 'next.config.ts';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(
  'import type { NextConfig } from "next";',
  'import type { NextConfig } from "next";\nimport createNextIntlPlugin from "next-intl/plugin";\n\nconst withNextIntl = createNextIntlPlugin("./src/i18n.ts");'
);

c = c.replace(
  'export default nextConfig;',
  'export default withNextIntl(nextConfig);'
);

fs.writeFileSync(file, c);
console.log('Fixed next.config.ts');
