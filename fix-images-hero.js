const fs = require('fs');
let c = fs.readFileSync('src/components/home/HeroSlider.tsx', 'utf8');

if (!c.includes('import Image from "next/image"')) {
  c = c.replace("import Link from 'next/link';", "import Link from 'next/link';\nimport Image from 'next/image';");
}

c = c.replace(
  /<img\s+key={index}\s+alt={slider\.title}\s+className={`absolute inset-0 w-full h-full object-cover object-center z-0 transition-all duration-\[2000ms\] ease-in-out \${[^}]+}`}\s+src={encodeURI\(slider\.image_url\)}\s+\/>/g,
  (match) => {
    return match.replace('<img', '<Image fill').replace('src=', 'src=');
  }
);
// Hardcoded replace because of template literals might be tricky with regex
c = c.replace(
  '<img',
  '<Image fill sizes="100vw" priority={index === 0}'
);
// It's safer to just replace manually:
c = fs.readFileSync('src/components/home/HeroSlider.tsx', 'utf8');
if (!c.includes('import Image from "next/image"')) {
  c = c.replace("import Link from 'next/link';", "import Link from 'next/link';\nimport Image from 'next/image';");
}

c = c.replace(
  /<img\n\s+key=\{index\}\n\s+alt=\{slider\.title\}\n\s+className=\{`(.*?)`\}\n\s+src=\{encodeURI\(slider\.image_url\)\}\n\s+\/>/g,
  '<Image\n          key={index}\n          alt={slider.title}\n          className={`$1`}\n          src={encodeURI(slider.image_url)}\n          fill\n          sizes="100vw"\n          priority={index === 0}\n        />'
);

fs.writeFileSync('src/components/home/HeroSlider.tsx', c);
console.log('Hero slider images optimized');
