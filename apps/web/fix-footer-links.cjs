const fs = require("fs");
let p = "src/app/[locale]/(public)/layout.tsx";
let c = fs.readFileSync(p, "utf8");

c = c.replace(/href="\/"/g, 'href={locale === "en" ? "/en" : "/"}');
c = c.replace(/href="\/kategori\?cluster=kuliner"/g, 'href={locale === "en" ? "/en/kategori?cluster=kuliner" : "/kategori?cluster=kuliner"}');
c = c.replace(/href="\/event"/g, 'href={locale === "en" ? "/en/event" : "/event"}');
c = c.replace(/href="\/peta"/g, 'href={locale === "en" ? "/en/peta" : "/peta"}');
c = c.replace(/href="\/pusat-bantuan"/g, 'href={locale === "en" ? "/en/pusat-bantuan" : "/pusat-bantuan"}');

// Make sure `locale` is available in layout.tsx. We already have `const { locale } = await params;` or similar? Let's check:
//   export default async function PublicLayout({
//     children,
//   }: {
//     children: React.ReactNode;
//   }) {
// Oh wait, `layout.tsx` might not have `locale` extracted. Let me fix the script to handle that.
