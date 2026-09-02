const fs = require('fs');
let c = fs.readFileSync('src/components/home/HeroSlider.tsx', 'utf8');

c = c.replace(
  'drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)] mb-2 z-10 relative',
  'drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)] mb-6 md:mb-10 z-10 relative'
);

fs.writeFileSync('src/components/home/HeroSlider.tsx', c);
console.log('Moved JELAJAHI up');
