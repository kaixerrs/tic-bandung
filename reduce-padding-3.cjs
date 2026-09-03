const fs = require("fs");
let p = "apps/web/src/components/ui/ModernHero.tsx";
let c = fs.readFileSync(p, "utf8");

c = c.replace(
  '<section className="relative w-full flex flex-col pt-0 pb-8 md:pb-12 lg:pb-16">',
  '<section className="relative w-full flex flex-col pt-4 md:pt-6 pb-8 md:pb-12 lg:pb-16">'
);

fs.writeFileSync(p, c, "utf8");
console.log("Padding set to pt-4 md:pt-6");
