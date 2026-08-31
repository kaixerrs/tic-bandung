const fs = require('fs');
let c = fs.readFileSync('src/components/home/CoECountdownBanner.tsx', 'utf8');

// Container padding
c = c.replace(
  'p-6 md:p-8 rounded-3xl',
  'p-4 md:p-8 rounded-2xl md:rounded-3xl'
);

// Gaps
c = c.replace(
  'gap-3 md:gap-6',
  'gap-2 md:gap-6'
);

// Box sizes and text
c = c.replace(
  /w-16 h-16 md:w-20 md:h-20/g,
  'w-14 h-14 md:w-20 md:h-20'
);

c = c.replace(
  /text-2xl md:text-4xl/g,
  'text-xl md:text-4xl'
);

fs.writeFileSync('src/components/home/CoECountdownBanner.tsx', c);
console.log('Fixed mobile timer');
