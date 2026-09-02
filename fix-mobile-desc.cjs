const fs = require("fs");
let p = "apps/web/src/components/home/HeroSlider.tsx";
let c = fs.readFileSync(p, "utf8");

c = c.replace(/className="hidden md:block font-body-lg text-\[14px\] md:text-\[20px\] text-white\/90 mb-8 md:mb-12 max-w-2xl tracking-wide leading-relaxed px-4 drop-shadow-md font-medium"/,
  'className="block font-body-lg text-[14px] md:text-[20px] text-white/90 mb-8 md:mb-12 max-w-2xl tracking-wide leading-relaxed px-4 drop-shadow-md font-medium"'
);

fs.writeFileSync(p, c, "utf8");
console.log("Mobile description unhidden");
