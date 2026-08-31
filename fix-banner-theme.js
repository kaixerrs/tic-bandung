const fs = require('fs');
let c = fs.readFileSync('src/components/home/CoECountdownBanner.tsx', 'utf8');

// Container
c = c.replace(
  'section className="w-full bg-[#1b1c1a] relative overflow-hidden py-12 md:py-16"',
  'section className="w-full bg-white relative overflow-hidden py-12 md:py-16 border-y border-slate-100"'
);

// Title
c = c.replace(
  'text-3xl md:text-5xl font-bold text-white mb-4 leading-tight',
  'text-3xl md:text-5xl font-bold text-slate-900 mb-4 leading-tight'
);

// Description
c = c.replace(
  'text-slate-300 text-sm md:text-base leading-relaxed mb-8 max-w-2xl mx-auto lg:mx-0',
  'text-slate-600 text-sm md:text-base leading-relaxed mb-8 max-w-2xl mx-auto lg:mx-0'
);

// Timer Box
c = c.replace(
  'bg-white/5 backdrop-blur-md border border-white/10 p-6 md:p-8 rounded-3xl shadow-2xl relative',
  'bg-[#fcf9f5] border border-slate-200 p-6 md:p-8 rounded-3xl shadow-xl relative'
);

// Timer Text
c = c.replace(
  'text-white/80 font-medium mb-6',
  'text-slate-600 font-bold mb-6'
);

// Timer Box numbers (hours, minutes) - there are two of these
c = c.replace(
  /w-16 h-16 md:w-20 md:h-20 bg-slate-800 rounded-2xl flex items-center justify-center text-2xl md:text-4xl font-bold text-white shadow-inner border border-slate-700\/50/g,
  'w-16 h-16 md:w-20 md:h-20 bg-white rounded-2xl flex items-center justify-center text-2xl md:text-4xl font-bold text-slate-800 shadow-sm border border-slate-200'
);

// Timer Box numbers (days)
c = c.replace(
  /w-16 h-16 md:w-20 md:h-20 bg-slate-800 rounded-2xl flex items-center justify-center text-2xl md:text-4xl font-bold text-\[#C9971E\] shadow-inner border border-slate-700\/50/g,
  'w-16 h-16 md:w-20 md:h-20 bg-white rounded-2xl flex items-center justify-center text-2xl md:text-4xl font-bold text-[#C9971E] shadow-sm border border-slate-200'
);

// Timer Box numbers (seconds)
c = c.replace(
  /w-16 h-16 md:w-20 md:h-20 bg-slate-800 rounded-2xl flex items-center justify-center text-2xl md:text-4xl font-bold text-\[#3D7A5E\] shadow-inner border border-slate-700\/50/g,
  'w-16 h-16 md:w-20 md:h-20 bg-white rounded-2xl flex items-center justify-center text-2xl md:text-4xl font-bold text-[#3D7A5E] shadow-sm border border-slate-200'
);

// Timer Labels
c = c.replace(
  /text-\[10px\] md:text-xs text-slate-400 mt-2 uppercase tracking-wider font-bold/g,
  'text-[10px] md:text-xs text-slate-500 mt-2 uppercase tracking-wider font-bold'
);

// Colons
c = c.replace(
  /text-2xl md:text-4xl font-bold text-slate-600 mt-4 md:mt-5/g,
  'text-2xl md:text-4xl font-bold text-slate-300 mt-4 md:mt-5'
);

// Footer
c = c.replace(
  'mt-6 text-center text-xs text-slate-500 font-medium bg-black/20 py-2 rounded-lg',
  'mt-6 text-center text-xs text-slate-600 font-bold bg-slate-200/50 py-2 rounded-lg'
);

fs.writeFileSync('src/components/home/CoECountdownBanner.tsx', c);
console.log('Fixed banner theme');
