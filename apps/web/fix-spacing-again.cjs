const fs = require("fs");

// Fix ModernHero
let p1 = "src/components/ui/ModernHero.tsx";
let c1 = fs.readFileSync(p1, "utf8");
c1 = c1.replace(/pt-24 md:pt-32/g, "pt-16 md:pt-20");
fs.writeFileSync(p1, c1, "utf8");

// Fix CategoryListingUI
let p2 = "src/components/public/CategoryListingUI.tsx";
let c2 = fs.readFileSync(p2, "utf8");
c2 = c2.replace(/pt-24 md:pt-32/g, "pt-16 md:pt-20");
fs.writeFileSync(p2, c2, "utf8");

console.log("Spacing reduced again");
