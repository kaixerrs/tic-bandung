const fs = require("fs");
let p = "apps/web/src/app/[locale]/(public)/paket-wisata/page.tsx";
let c = fs.readFileSync(p, "utf8");

c = c.replace(/className="relative z-20 w-full max-w-\[1600px\] px-4 md:px-8 lg:px-12 mx-auto pb-16 md:pb-32 -mt-8"/,
  'className="relative z-20 w-full max-w-[1600px] px-4 md:px-8 lg:px-12 mx-auto pb-16 md:pb-32 mt-4 md:-mt-8"'
);

fs.writeFileSync(p, c, "utf8");
console.log("Paket Wisata mobile overlap fixed");
