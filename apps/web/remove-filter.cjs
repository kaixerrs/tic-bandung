const fs = require("fs");
let p = "src/components/public/CategoryListingUI.tsx";
let c = fs.readFileSync(p, "utf8");

// Remove everything from {/* Filter Bar (FR-03) */} down to the closing </div> of the filter bar (before {/* Results Info */})
const startStr = "{/* Filter Bar (FR-03) */}";
const endStr = "        {/* Results Info */}";

let startIdx = c.indexOf(startStr);
let endIdx = c.indexOf(endStr);

if (startIdx !== -1 && endIdx !== -1) {
  c = c.substring(0, startIdx) + c.substring(endIdx);
  fs.writeFileSync(p, c, "utf8");
  console.log("Filter bar removed");
} else {
  console.log("Could not find boundaries");
}
