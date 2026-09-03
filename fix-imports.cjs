const fs = require("fs");

function fix(p) {
  let c = fs.readFileSync(p, "utf8");
  if (!c.includes("import { requireAdminAuth } from './admin';") && !c.includes("import { requireAdminAuth } from \"./admin\";")) {
    c = c.replace("\"use server\";", "\"use server\";\nimport { requireAdminAuth } from './admin';");
    fs.writeFileSync(p, c, "utf8");
    console.log(p + " fixed import");
  }
}

fix("apps/admin/src/app/actions/category.ts");
fix("apps/admin/src/app/actions/destination.ts");
fix("apps/admin/src/app/actions/event.ts");
