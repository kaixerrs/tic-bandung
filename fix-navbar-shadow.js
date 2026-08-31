const fs = require('fs');
let c = fs.readFileSync('src/components/public/Navbar.tsx', 'utf8');

c = c.replace(
  '<div className="flex flex-col">',
  '<div className="flex flex-col drop-shadow-md">'
);

c = c.replace(
  "className={`text-sm md:text-lg font-bold leading-tight ${scrolled ? 'text-slate-900' : 'text-white'}`}",
  "className={`text-sm md:text-lg font-bold leading-tight ${scrolled ? 'text-slate-900 drop-shadow-none' : 'text-white'}`}"
);

c = c.replace(
  "className={`text-[8px] md:text-[10px] font-bold tracking-[0.15em] ${scrolled ? 'text-[#3D7A5E]' : 'text-white/80'}`}",
  "className={`text-[8px] md:text-[10px] font-bold tracking-[0.15em] ${scrolled ? 'text-[#3D7A5E] drop-shadow-none' : 'text-white/90'}`}"
);

fs.writeFileSync('src/components/public/Navbar.tsx', c);
console.log('Fixed navbar shadow');
