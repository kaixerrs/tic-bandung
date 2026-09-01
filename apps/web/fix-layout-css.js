const fs = require('fs');
const file = 'src/app/[locale]/layout.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace('import "./globals.css";', 'import "../globals.css";');

fs.writeFileSync(file, c);
console.log('Fixed css import');
