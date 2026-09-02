const fs = require("fs");
let p = "src/app/[locale]/(public)/layout.tsx";
let c = fs.readFileSync(p, "utf8");

c = c.replace(/export default async function PublicLayout\(\{\r?\n  children,\r?\n\}: \{\r?\n  children: React\.ReactNode;\r?\n\}\) \{/g, `export default async function PublicLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;`);

fs.writeFileSync(p, c, "utf8");
console.log("Layout params injected with regex");
