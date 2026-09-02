const fs = require('fs');
const file = 'apps/web/src/app/(public)/pusat-bantuan/page.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(
  'className="absolute inset-0 z-0 grayscale hover:grayscale-0 transition-all duration-700"',
  'className="absolute inset-0 z-0 transition-all duration-700"'
);

fs.writeFileSync(file, c);
console.log('Removed grayscale from map');
