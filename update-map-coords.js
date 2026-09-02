const fs = require('fs');
const file = 'apps/web/src/app/(public)/pusat-bantuan/page.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replaceAll(
  'href="https://maps.google.com/maps?q=Tourist%20Information%20Center%20Bandung"',
  'href="https://www.google.com/maps?q=-6.9217848810924565,107.60756931267107"'
);

fs.writeFileSync(file, c);
console.log('Updated map coordinates');
