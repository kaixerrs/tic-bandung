const fs = require("fs");
let p = "apps/admin/src/components/admin/DestinationForm.tsx";
let c = fs.readFileSync(p, "utf8");

c = c.replace(
  'onChange={(val) => setValue("category_id", val, { shouldValidate: true })}',
  'onChange={(e) => setValue("category_id", e.target.value, { shouldValidate: true })}'
);

fs.writeFileSync(p, c, "utf8");
console.log("Fixed CustomSelect onChange");
