const fs = require('fs');
let c = fs.readFileSync('src/app/(public)/page.tsx', 'utf8');

if (!c.includes('import CoECountdownBanner from')) {
  c = c.replace(
    "import HeroSlider from '@/components/home/HeroSlider';",
    "import HeroSlider from '@/components/home/HeroSlider';\nimport CoECountdownBanner from '@/components/home/CoECountdownBanner';"
  );
  
  c = c.replace(
    '<HeroSlider sliders={activeSliders} />',
    '<HeroSlider sliders={activeSliders} />\n      <CoECountdownBanner />'
  );
  
  fs.writeFileSync('src/app/(public)/page.tsx', c);
  console.log('Injected CoECountdownBanner');
}
