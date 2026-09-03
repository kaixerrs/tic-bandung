const fs = require("fs");
let p = "apps/web/src/components/public/Navbar.tsx";
let c = fs.readFileSync(p, "utf8");

const oldMenu = `            return (
              <Link 
                key={link.id}
                href={link.href}
                className={\`relative font-label-caps text-[12px] font-bold uppercase tracking-widest transition-colors duration-300 \${
                  isTransparent 
                    ? (isActive ? 'text-white' : 'text-white/80 hover:text-[#FFCC00]')
                    : (isActive ? 'text-[#00C853]' : 'text-slate-600 hover:text-[#00C853]')
                }\`}
              >
                {link.name}
              </Link>
            );`;

const newMenu = `            if (link.id === 'event') {
              return (
                <div key={link.id} className="relative group">
                  <button className={\`font-label-caps text-[12px] font-bold uppercase tracking-widest transition-colors duration-300 flex items-center gap-1 \${
                    isTransparent 
                      ? (isActive ? 'text-white' : 'text-white/80 hover:text-[#FFCC00]')
                      : (isActive ? 'text-[#00C853]' : 'text-slate-600 hover:text-[#00C853]')
                  }\`}>
                    {link.name}
                    <svg className="w-3 h-3 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </button>
                  <div className="absolute top-full left-0 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                    <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-2 min-w-[200px] flex flex-col gap-1">
                      <Link href={getHref('/event')} className="px-4 py-2 text-sm font-bold text-gray-700 hover:text-[#00C853] hover:bg-green-50 rounded-lg transition-colors">Kalender Event</Link>
                      <Link href={getHref('/event/pendaftaran')} className="px-4 py-2 text-sm font-bold text-gray-700 hover:text-[#00C853] hover:bg-green-50 rounded-lg transition-colors">Daftar Event Baru</Link>
                    </div>
                  </div>
                </div>
              );
            }
            return (
              <Link 
                key={link.id}
                href={link.href}
                className={\`relative font-label-caps text-[12px] font-bold uppercase tracking-widest transition-colors duration-300 \${
                  isTransparent 
                    ? (isActive ? 'text-white' : 'text-white/80 hover:text-[#FFCC00]')
                    : (isActive ? 'text-[#00C853]' : 'text-slate-600 hover:text-[#00C853]')
                }\`}
              >
                {link.name}
              </Link>
            );`;

c = c.replace(oldMenu, newMenu);

// Do the same for mobile menu
const oldMobile = `              <Link 
                key={link.name}
                onClick={() => setIsOpen(false)} 
                className={\`block px-4 py-3 rounded-xl font-bold transition-colors \${
                  isActive 
                    ? 'bg-amber-50 text-amber-700' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-amber-600'
                }\`} 
                href={link.href}
              >
                {link.name}
              </Link>`;

const newMobile = `              if (link.id === 'event') {
                return (
                  <div key={link.id} className="flex flex-col gap-1">
                    <div className="px-4 py-3 text-slate-400 font-label-caps text-xs font-bold uppercase tracking-widest">{link.name}</div>
                    <Link onClick={() => setIsOpen(false)} href={getHref('/event')} className={\`block pl-8 pr-4 py-2 rounded-xl font-bold transition-colors \${isActive && normalizedPathname === '/event' ? 'bg-amber-50 text-amber-700' : 'text-slate-600 hover:bg-slate-50 hover:text-amber-600'}\`}>Kalender Event</Link>
                    <Link onClick={() => setIsOpen(false)} href={getHref('/event/pendaftaran')} className={\`block pl-8 pr-4 py-2 rounded-xl font-bold transition-colors \${isActive && normalizedPathname.includes('pendaftaran') ? 'bg-amber-50 text-amber-700' : 'text-slate-600 hover:bg-slate-50 hover:text-amber-600'}\`}>Daftar Event Baru</Link>
                  </div>
                );
              }
              return (
                <Link 
                  key={link.id}
                  onClick={() => setIsOpen(false)} 
                  className={\`block px-4 py-3 rounded-xl font-bold transition-colors \${
                    isActive 
                      ? 'bg-amber-50 text-amber-700' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-amber-600'
                  }\`} 
                  href={link.href}
                >
                  {link.name}
                </Link>
              );`;

c = c.replace(oldMobile, newMobile);

fs.writeFileSync(p, c, "utf8");
console.log("Navbar updated with dropdown");
