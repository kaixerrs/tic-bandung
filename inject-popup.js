const fs = require('fs');
let c = fs.readFileSync('src/app/(public)/page.tsx', 'utf8');

if (!c.includes('import PromoPopup from')) {
  c = c.replace(
    "import HeroSlider from '@/components/home/HeroSlider';",
    "import HeroSlider from '@/components/home/HeroSlider';\nimport PromoPopup from '@/components/home/PromoPopup';"
  );
  
  c = c.replace(
    '<main className="w-full bg-[#fcf9f5] min-h-screen overflow-x-hidden">',
    '<main className="w-full bg-[#fcf9f5] min-h-screen overflow-x-hidden">\n      <PromoPopup />'
  );
  fs.writeFileSync('src/app/(public)/page.tsx', c);
  console.log('Injected PromoPopup');
}
