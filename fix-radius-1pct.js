const fs = require('fs');
const path = require('path');

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
  if (filePath.includes('(admin)')) return;
  let c = fs.readFileSync(filePath, 'utf8');
  let original = c;

  c = c.replace(/md:rounded-lg/g, 'md:rounded-sm');
  c = c.replace(/rounded-lg/g, 'rounded-sm');

  if (c !== original) {
    fs.writeFileSync(filePath, c);
    totalChanged++;
    console.log('Fixed: ' + filePath);
  }
}

walkDir('src/app/(public)', fixFile);
walkDir('src/components/home', fixFile);
walkDir('src/components/public', fixFile);
walkDir('src/components/ui', fixFile);

console.log('\nTotal files changed: ' + totalChanged);
