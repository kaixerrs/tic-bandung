const fs = require('fs');
const file = 'apps/web/src/components/public/Navbar.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(
  "{ name: 'Maps', href: '/peta' }",
  "{ name: 'Pusat Bantuan', href: '/pusat-bantuan' }"
);

fs.writeFileSync(file, c);
console.log('Updated navbar');
