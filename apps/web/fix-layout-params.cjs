const fs = require("fs");
let p = "src/app/[locale]/(public)/layout.tsx";
let c = fs.readFileSync(p, "utf8");

const target = `export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();`;

const replacement = `export default async function PublicLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const settings = await getSiteSettings();`;

if (c.includes(target)) {
    c = c.replace(target, replacement);
    fs.writeFileSync(p, c, "utf8");
    console.log("Layout params injected");
} else {
    console.log("Target string not found, current signature is:");
    console.log(c.substring(0, 500));
}
