const fs = require("fs");
let p = "apps/web/src/components/public/Navbar.tsx";
let c = fs.readFileSync(p, "utf8");

c = c.replace(/const getHref = \(path\) =>/, "const getHref = (path: string) =>");

fs.writeFileSync(p, c, "utf8");
console.log("TypeScript error fixed");
