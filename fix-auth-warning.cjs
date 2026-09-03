const fs = require("fs");
let p = "apps/admin/src/app/actions/admin.ts";
let c = fs.readFileSync(p, "utf8");

c = c.replace(
  "const { data: { session } } = await supabase.auth.getSession();\n  \n  if (!session?.user)",
  "const { data: { user } } = await supabase.auth.getUser();\n  \n  if (!user)"
);

c = c.replace(
  "eq('user_id', session.user.id);",
  "eq('user_id', user.id);"
);

fs.writeFileSync(p, c, "utf8");
console.log("Fixed auth warning");
