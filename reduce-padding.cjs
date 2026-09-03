const fs = require("fs");
let p = "apps/web/src/components/ui/ModernHero.tsx";
let c = fs.readFileSync(p, "utf8");

c = c.replace(
  '<section className="relative w-full flex flex-col pt-16 md:pt-20 pb-8 md:pb-12 lg:pb-16">',
  '<section className="relative w-full flex flex-col pt-6 md:pt-8 pb-8 md:pb-12 lg:pb-16">'
);

fs.writeFileSync(p, c, "utf8");
console.log("Padding reduced");
