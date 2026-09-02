const fs = require("fs");
let p = "apps/web/src/app/[locale]/(public)/kategori/page.tsx";
let c = fs.readFileSync(p, "utf8");

c = c.replace(/<span[^>]*>\{getCount[^}]+\}\}<\/span>/g, "");

fs.writeFileSync(p, c, "utf8");
console.log("Lokasi badges removed from kategori page");
