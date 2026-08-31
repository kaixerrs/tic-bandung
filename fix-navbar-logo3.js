const fs = require('fs');
let c = fs.readFileSync('src/components/public/Navbar.tsx', 'utf8');

c = c.replace(
  'const isActive = pathname === link.href || (link.href !== \'/\' && pathname.startsWith(link.href));',
  'const isActive = pathname === link.href || (link.href !== \'/\' && pathname.startsWith(link.href));'
); // dummy check

// Replace the color classes for the logo text to be dark permanently
c = c.replace(
  /className=\{`text-sm md:text-lg font-bold leading-tight \$\{scrolled \? 'text-slate-900 drop-shadow-none' : 'text-white'\}`\}/g,
  'className="text-sm md:text-lg font-bold leading-tight text-slate-900"'
);

c = c.replace(
  /className=\{`text-\[8px\] md:text-\[10px\] font-bold tracking-\[0\.15em\] \$\{scrolled \? 'text-\[\#3D7A5E\] drop-shadow-none' : 'text-white\/90'\}`\}/g,
  'className="text-[8px] md:text-[10px] font-bold tracking-[0.15em] text-[#3D7A5E]"'
);

// Fallback if the drop-shadow wasn't there
c = c.replace(
  /className=\{`text-sm md:text-lg font-bold leading-tight \$\{scrolled \? 'text-slate-900' : 'text-white'\}`\}/g,
  'className="text-sm md:text-lg font-bold leading-tight text-slate-900"'
);

c = c.replace(
  /className=\{`text-\[8px\] md:text-\[10px\] font-bold tracking-\[0\.15em\] \$\{scrolled \? 'text-\[\#3D7A5E\]' : 'text-white\/80'\}`\}/g,
  'className="text-[8px] md:text-[10px] font-bold tracking-[0.15em] text-[#3D7A5E]"'
);


fs.writeFileSync('src/components/public/Navbar.tsx', c);
console.log('Fixed navbar logo text color');
