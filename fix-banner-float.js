const fs = require('fs');
let c = fs.readFileSync('src/components/home/CoECountdownBanner.tsx', 'utf8');

c = c.replace(
  'section className="w-full bg-white relative overflow-hidden py-12 md:py-16 border-y border-slate-100"',
  'section className="w-full bg-white relative overflow-hidden py-8 md:py-10 border border-slate-100 rounded-3xl shadow-2xl max-w-[1400px] mx-auto -mt-16 md:-mt-24 z-40"'
);

// We need to add margin horizontally for mobile so it doesn't touch edges
c = c.replace(
  'section className="w-full bg-white relative overflow-hidden py-8 md:py-10 border border-slate-100 rounded-3xl shadow-2xl max-w-[1400px] mx-auto -mt-16 md:-mt-24 z-40"',
  'section className="w-[calc(100%-2rem)] md:w-[calc(100%-4rem)] bg-white relative overflow-hidden py-8 md:py-10 border border-slate-100 rounded-2xl md:rounded-3xl shadow-2xl max-w-[1400px] mx-auto -mt-16 md:-mt-24 z-40"'
);


fs.writeFileSync('src/components/home/CoECountdownBanner.tsx', c);
console.log('Fixed banner to float');
