const fs = require("fs");
let p = "src/app/[locale]/(public)/pusat-bantuan/page.tsx";
let c = fs.readFileSync(p, "utf8");

c = c.replace(/Pusat Bantuan\s*<\/h1>/, "{locale === 'en' ? 'Help Center' : 'Pusat Bantuan'}\n          </h1>");

fs.writeFileSync(p, c, "utf8");
console.log("Help center title fixed");
