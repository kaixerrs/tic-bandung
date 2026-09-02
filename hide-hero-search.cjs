const fs = require("fs");
let p = "apps/web/src/components/home/HeroSlider.tsx";
let c = fs.readFileSync(p, "utf8");

c = c.replace(/className="bg-white\/95 backdrop-blur-xl border border-white\/60 w-full max-w-lg p-1.5 md:p-2 flex items-center rounded-2xl shadow-\[0_20px_60px_-15px_rgba\(0,0,0,0.5\)\] mx-auto relative z-50"/g, 
  'className="hidden bg-white/95 backdrop-blur-xl border border-white/60 w-full max-w-lg p-1.5 md:p-2 items-center rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] mx-auto relative z-50"');

fs.writeFileSync(p, c, "utf8");
console.log("Search bar in HeroSlider hidden");
