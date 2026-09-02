const fs = require('fs');
let c = fs.readFileSync('src/components/home/HeroSlider.tsx', 'utf8');

const oldBandung = `<h1 className={\`\${allisonFont.className} animate-slide-up-delay-1 text-[80px] md:text-[140px] lg:text-[180px] leading-[0.6] text-[#00C853] mb-8 z-10 relative\`} style={{ textShadow: '0 4px 20px rgba(0, 200, 83, 0.5), 0 0 80px rgba(0, 122, 51, 0.3)' }}>`;

const newBandung = `<h1 className={\`\${allisonFont.className} animate-slide-up-delay-1 text-[130px] md:text-[200px] lg:text-[260px] leading-[0.4] text-[#00C853] mb-8 mt-[-30px] md:mt-[-60px] lg:mt-[-80px] z-10 relative\`} style={{ textShadow: '0 4px 20px rgba(0, 200, 83, 0.5), 0 0 80px rgba(0, 122, 51, 0.3)' }}>`;

c = c.replace(oldBandung, newBandung);

fs.writeFileSync('src/components/home/HeroSlider.tsx', c);
console.log('Enlarged Bandung text and added negative margin for overlap');
