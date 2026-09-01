const fs = require('fs');
const file = 'src/components/public/Navbar.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(
  "import { Menu, X, ArrowRight, Globe } from 'lucide-react';",
  "import { Menu, X, ArrowRight, Globe } from 'lucide-react';\nimport LanguageSwitcher from './LanguageSwitcher';"
);

c = c.replace(
  '<div className="hidden lg:flex items-center gap-5">\n          <Link',
  '<div className="hidden lg:flex items-center gap-5">\n          <LanguageSwitcher />\n          <Link'
);

c = c.replace(
  '<div className="pt-4 mt-2 border-t border-slate-100">\n            <Link',
  '<div className="pt-4 mt-2 border-t border-slate-100 flex flex-col gap-3">\n            <div className="flex justify-center">\n              <LanguageSwitcher />\n            </div>\n            <Link'
);

fs.writeFileSync(file, c);
console.log('Fixed navbar lang switcher');
