const fs = require("fs");

function secureFile(p) {
  let c = fs.readFileSync(p, "utf8");
  if (!c.includes("requireAdminAuth")) {
    if (c.includes("import { logAdminAction }")) {
      c = c.replace(
        "import { logAdminAction } from './log';",
        "import { logAdminAction } from './log';\nimport { requireAdminAuth } from './admin';"
      );
    } else {
      c = "import { requireAdminAuth } from './admin';\n" + c;
    }
    
    // Inject into all action functions
    c = c.replace(/export async function ([a-zA-Z0-9_]+)\((.*?)\) \{/g, (match, funcName, args) => {
      // Don't inject into public functions if any exist, but in eventSubmission admin shouldn't be public.
      // Wait, is submitEvent public? 
      // Yes, submitEvent in eventSubmission.ts is PUBLIC! The public submits events.
      if (funcName === "submitEvent" || funcName === "submitEventForm") {
        return match;
      }
      return `export async function ${funcName}(${args}) {\n  await requireAdminAuth();`;
    });

    fs.writeFileSync(p, c, "utf8");
    console.log(p + " secured");
  }
}

secureFile("apps/admin/src/app/actions/event.ts");
secureFile("apps/admin/src/app/actions/eventSubmission.ts");
