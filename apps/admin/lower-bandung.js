const fs = require('fs');
let c = fs.readFileSync('src/components/home/HeroSlider.tsx', 'utf8');

c = c.replace(
  'lg:mt-[-80px]',
  'lg:mt-[-40px]'
).replace(
  'md:mt-[-60px]',
  'md:mt-[-30px]'
).replace(
  'mt-[-30px]',
  'mt-[-15px]'
);

fs.writeFileSync('src/components/home/HeroSlider.tsx', c);
console.log('Lowered Bandung text');
