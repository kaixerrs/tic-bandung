const fs = require("fs");
let p = "src/components/public/CategoryListingUI.tsx";
let c = fs.readFileSync(p, "utf8");

c = c.replace(/className="pt-32 pb-24 relative overflow-hidden"/, 'className="pt-24 md:pt-32 pb-12 lg:pb-16 relative overflow-hidden"');
c = c.replace(/className="max-w-\[1600px\] mx-auto px-4 md:px-8 lg:px-12 relative z-10 mt-10"/, 'className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 relative z-10"');

fs.writeFileSync(p, c, "utf8");
console.log("CategoryListingUI spacing aligned to ModernHero");
