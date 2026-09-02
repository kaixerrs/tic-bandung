const fs = require("fs");
let p = "src/components/ui/ModernHero.tsx";
let c = fs.readFileSync(p, "utf8");

c = c.replace(/className="relative w-full flex flex-col pt-32 md:pt-40 pb-8 md:pb-12 lg:pb-16"/, 'className="relative w-full flex flex-col pt-24 md:pt-32 pb-8 md:pb-12 lg:pb-16"');

fs.writeFileSync(p, c, "utf8");
console.log("ModernHero spacing fine-tuned");
