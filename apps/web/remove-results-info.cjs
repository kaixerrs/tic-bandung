const fs = require("fs");
let p = "src/components/public/CategoryListingUI.tsx";
let c = fs.readFileSync(p, "utf8");

// We need to remove the Results Info block
const strToRemove = `        {/* Results Info */}
        <div className="mb-6 text-[#4f4635] font-medium">
          {tc('showing')} <span className="text-[#1b1c1a] font-bold">{filteredDestinations.length}</span> {tc('destinations')}
        </div>`;

c = c.replace(strToRemove, "");

fs.writeFileSync(p, c, "utf8");
console.log("Results Info removed");
