const fs = require("fs");
let p = "apps/admin/src/app/actions/admin.ts";
let c = fs.readFileSync(p, "utf8");

const newFunc = `
export async function requireAdminAuth() {
  const supabase = await createServerClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    throw new Error("Unauthorized. Security validation failed.");
  }
  return user;
}
`;

if (!c.includes("requireAdminAuth")) {
  c = c + "\n" + newFunc;
  fs.writeFileSync(p, c, "utf8");
  console.log("requireAdminAuth added");
}
