const fs = require('fs');

function optimizeFile(file) {
  if (!fs.existsSync(file)) return;
  let c = fs.readFileSync(file, 'utf8');
  let changed = false;

  if (c.includes('<img') && !c.includes("import Image from 'next/image';") && !c.includes('import Image from "next/image";')) {
    c = c.replace("import Link from 'next/link';", "import Link from 'next/link';\nimport Image from 'next/image';");
    changed = true;
  }
  
  if (c.includes('<img')) {
    c = c.replace(/<img /g, '<Image fill sizes="(max-width: 768px) 100vw, 50vw" ');
    changed = true;
  }
  
  if (changed) {
    fs.writeFileSync(file, c);
    console.log('Optimized images in: ' + file);
  }
}

optimizeFile('src/app/(public)/page.tsx');
optimizeFile('src/app/(public)/transportasi/page.tsx');
optimizeFile('src/app/(public)/destinasi/[slug]/page.tsx');

