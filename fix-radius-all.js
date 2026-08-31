const fs = require('fs');
const path = require('path');

const publicDir = 'src/app/(public)';
const componentsDir = 'src/components';

function walkDir(dir, callback) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(f => {
    let p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) walkDir(p, callback);
    else if (p.endsWith('.tsx')) callback(p);
  });
}

let totalChanged = 0;

function fixFile(filePath) {
  let c = fs.readFileSync(filePath, 'utf8');
  let original = c;

  // Skip admin pages entirely
  if (filePath.includes('(admin)')) return;

  // Replace rounded-3xl with rounded-lg on card-like elements
  // rounded-3xl = 24px, rounded-lg = 8px (roughly 3% on a 300px card)
  c = c.replace(/md:rounded-3xl/g, 'md:rounded-lg');
  c = c.replace(/rounded-3xl/g, 'rounded-lg');
  
  // Replace rounded-2xl with rounded-lg on card-like elements  
  // rounded-2xl = 16px -> rounded-lg = 8px
  c = c.replace(/md:rounded-2xl/g, 'md:rounded-lg');
  c = c.replace(/rounded-2xl/g, 'rounded-lg');

  if (c !== original) {
    fs.writeFileSync(filePath, c);
    totalChanged++;
    console.log('Fixed: ' + filePath);
  }
}

walkDir(publicDir, fixFile);
walkDir('src/components/home', fixFile);
walkDir('src/components/public', fixFile);
walkDir('src/components/ui', fixFile);

console.log('\nTotal files changed: ' + totalChanged);
