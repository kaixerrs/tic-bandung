const fs = require("fs");
let p = "apps/web/src/app/[locale]/(public)/page.tsx";
let c = fs.readFileSync(p, "utf8");

// Replace the gallery grid container
const oldGrid = `<div className="grid grid-cols-1 md:grid-cols-4 grid-rows-[auto_auto] gap-4 md:gap-6 md:h-[500px] lg:h-[600px]">`;
const newGrid = `<div className="flex md:grid overflow-x-auto md:overflow-visible snap-x snap-mandatory gap-4 md:gap-6 md:grid-cols-4 md:grid-rows-[auto_auto] md:h-[500px] lg:h-[600px] pb-4 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">`;

c = c.replace(oldGrid, newGrid);

// Fix grid classes on gallery items for mobile swipe
// Item 0 (large): keep desktop span, make fixed width on mobile
c = c.replace(
  "if (i === 0) gridClass = 'md:col-span-2 md:row-span-2 h-[300px] md:h-auto';",
  "if (i === 0) gridClass = 'min-w-[80vw] md:min-w-0 md:col-span-2 md:row-span-2 h-[250px] md:h-auto snap-start';"
);

// Item 1
c = c.replace(
  "else if (i === 1) gridClass = 'md:col-span-2 h-[250px] md:h-auto';",
  "else if (i === 1) gridClass = 'min-w-[70vw] md:min-w-0 md:col-span-2 h-[250px] md:h-auto snap-start';"
);

// Default items
c = c.replace(
  "let gridClass = 'md:col-span-1 h-[250px] md:h-auto';",
  "let gridClass = 'min-w-[60vw] md:min-w-0 md:col-span-1 h-[250px] md:h-auto snap-start';"
);

fs.writeFileSync(p, c, "utf8");
console.log("Gallery converted to swipeable on mobile");
