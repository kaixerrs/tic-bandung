const fs = require("fs");
let p = "apps/web/src/components/public/Navbar.tsx";
let c = fs.readFileSync(p, "utf8");

c = c.replace(
  `className="px-4 py-2 text-sm font-bold text-gray-700 hover:text-[#00C853] hover:bg-green-50 rounded-lg transition-colors">Kalender Event</Link>`,
  `className="px-4 py-2 text-sm font-bold text-gray-700 hover:text-[#00C853] hover:bg-green-50 rounded-lg transition-colors">EVENT 2027</Link>`
);

c = c.replace(
  `className="px-4 py-2 text-sm font-bold text-gray-700 hover:text-[#00C853] hover:bg-green-50 rounded-lg transition-colors">Daftar Event Baru</Link>`,
  `className="px-4 py-2 text-sm font-bold text-gray-700 hover:text-[#00C853] hover:bg-green-50 rounded-lg transition-colors">Form COE 2027</Link>`
);

c = c.replace(
  `className={\`block pl-8 pr-4 py-2 rounded-xl font-bold transition-colors \${isActive && normalizedPathname === '/event' ? 'bg-amber-50 text-amber-700' : 'text-slate-600 hover:bg-slate-50 hover:text-amber-600'}\`}>Kalender Event</Link>`,
  `className={\`block pl-8 pr-4 py-2 rounded-xl font-bold transition-colors \${isActive && normalizedPathname === '/event' ? 'bg-amber-50 text-amber-700' : 'text-slate-600 hover:bg-slate-50 hover:text-amber-600'}\`}>EVENT 2027</Link>`
);

c = c.replace(
  `className={\`block pl-8 pr-4 py-2 rounded-xl font-bold transition-colors \${isActive && normalizedPathname.includes('pendaftaran') ? 'bg-amber-50 text-amber-700' : 'text-slate-600 hover:bg-slate-50 hover:text-amber-600'}\`}>Daftar Event Baru</Link>`,
  `className={\`block pl-8 pr-4 py-2 rounded-xl font-bold transition-colors \${isActive && normalizedPathname.includes('pendaftaran') ? 'bg-amber-50 text-amber-700' : 'text-slate-600 hover:bg-slate-50 hover:text-amber-600'}\`}>Form COE 2027</Link>`
);

fs.writeFileSync(p, c, "utf8");
console.log("Navbar renamed successfully");
