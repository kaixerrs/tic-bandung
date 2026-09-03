const fs = require("fs");

function fix(p){
  let c = fs.readFileSync(p, "utf8");
  if(c.includes("import { requireAdminAuth } from './admin';\n\"use server\";")) {
    c = c.replace(
      "import { requireAdminAuth } from './admin';\n\"use server\";",
      "\"use server\";\nimport { requireAdminAuth } from './admin';"
    );
    fs.writeFileSync(p, c, "utf8");
    console.log(p + " fixed");
  }
}

fix("apps/admin/src/app/actions/event.ts");
fix("apps/admin/src/app/actions/eventSubmission.ts");
