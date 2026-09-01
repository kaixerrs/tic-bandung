const fs = require('fs');
const file = 'src/app/[locale]/layout.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(
  "export default function RootLayout({",
  "import { NextIntlClientProvider } from 'next-intl';\nimport { getMessages } from 'next-intl/server';\n\nexport default async function RootLayout({"
);

c = c.replace(
  "children: React.ReactNode;",
  "children: React.ReactNode;\n  params: { locale: string };"
);

// We have to extract the locale and getMessages inside the function
c = c.replace(
  "}: Readonly<{",
  "}: Readonly<{"
); // Wait, this doesn't actually inject logic inside.

