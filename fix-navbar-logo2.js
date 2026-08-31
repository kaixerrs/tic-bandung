const fs = require('fs');
let c = fs.readFileSync('src/components/public/Navbar.tsx', 'utf8');

c = c.replace(
  '<Link href="/" className="flex-shrink-0 transition-transform hover:scale-105">\r\n          <img src="/logo/tictransparan.png" alt="TIC Kota Bandung" className="h-10 md:h-12 w-auto" />\r\n        </Link>',
  `<Link href="/" className="flex-shrink-0 transition-transform hover:scale-105 flex items-center gap-2 md:gap-3">
          <img src="/logo/tictransparan.png" alt="TIC Kota Bandung" className="h-10 md:h-12 w-auto" />
          <div className="flex flex-col">
            <span className={\`text-sm md:text-lg font-bold leading-tight \${scrolled ? 'text-slate-900' : 'text-white'}\`}>
              KOTA BANDUNG
            </span>
            <span className={\`text-[8px] md:text-[10px] font-bold tracking-[0.15em] \${scrolled ? 'text-[#3D7A5E]' : 'text-white/80'}\`}>
              TOURIST INFORMATION CENTER
            </span>
          </div>
        </Link>`
);

c = c.replace(
  '<Link href="/" className="flex-shrink-0 transition-transform hover:scale-105">\n          <img src="/logo/tictransparan.png" alt="TIC Kota Bandung" className="h-10 md:h-12 w-auto" />\n        </Link>',
  `<Link href="/" className="flex-shrink-0 transition-transform hover:scale-105 flex items-center gap-2 md:gap-3">
          <img src="/logo/tictransparan.png" alt="TIC Kota Bandung" className="h-10 md:h-12 w-auto" />
          <div className="flex flex-col">
            <span className={\`text-sm md:text-lg font-bold leading-tight \${scrolled ? 'text-slate-900' : 'text-white'}\`}>
              KOTA BANDUNG
            </span>
            <span className={\`text-[8px] md:text-[10px] font-bold tracking-[0.15em] \${scrolled ? 'text-[#3D7A5E]' : 'text-white/80'}\`}>
              TOURIST INFORMATION CENTER
            </span>
          </div>
        </Link>`
);

fs.writeFileSync('src/components/public/Navbar.tsx', c);
console.log('Fixed navbar logo text v2');
