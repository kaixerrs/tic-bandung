const fs = require("fs");
let p = "src/app/[locale]/(public)/layout.tsx";
let c = fs.readFileSync(p, "utf8");

c = c.replace(
  /export default async function PublicLayout\(\{\n  children,\n\}: \{\n  children: React\.ReactNode;\n\}\) \{/g,
  `export default async function PublicLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;`
);

c = c.replace(/href="\/"/g, 'href={locale === "en" ? "/en" : "/"}');
c = c.replace(/href="\/kategori\?cluster=kuliner"/g, 'href={locale === "en" ? "/en/kategori?cluster=kuliner" : "/kategori?cluster=kuliner"}');
c = c.replace(/href="\/event"/g, 'href={locale === "en" ? "/en/event" : "/event"}');
c = c.replace(/href="\/peta"/g, 'href={locale === "en" ? "/en/peta" : "/peta"}');
c = c.replace(/href="\/pusat-bantuan"/g, 'href={locale === "en" ? "/en/pusat-bantuan" : "/pusat-bantuan"}');

fs.writeFileSync(p, c, "utf8");
console.log("Footer links fixed");
