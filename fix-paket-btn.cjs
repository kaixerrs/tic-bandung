const fs = require("fs");
let p = "apps/web/src/components/public/Navbar.tsx";
let c = fs.readFileSync(p, "utf8");

c = c.replace(
  "className={`px-8 py-3 font-label-caps uppercase tracking-widest rounded-full shadow-sm hover:shadow-md transition-all flex items-center gap-2",
  "className={`px-4 py-2 md:px-8 md:py-3 text-xs md:text-sm font-label-caps uppercase tracking-widest rounded-full shadow-sm hover:shadow-md transition-all flex items-center gap-2"
);

fs.writeFileSync(p, c, "utf8");
console.log("Paket Wisata button size reduced on mobile");
