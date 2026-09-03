const fs = require("fs");
let p = "apps/admin/src/app/actions/destination.ts";
let c = fs.readFileSync(p, "utf8");

if (!c.includes("requireAdminAuth")) {
  c = c.replace(
    "import { logAdminAction } from './log';",
    "import { logAdminAction } from './log';\nimport { requireAdminAuth } from './admin';"
  );
  
  // Inject into all action functions
  c = c.replace(/export async function ([a-zA-Z0-9_]+)\((.*?)\) \{/g, (match, funcName, args) => {
    return `export async function ${funcName}(${args}) {\n  await requireAdminAuth();`;
  });

  fs.writeFileSync(p, c, "utf8");
  console.log("destination actions secured");
}
