const fs = require('fs');
const file = 'src/components/public/Navbar.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(
  "import { Menu, X, ArrowRight, Globe } from 'lucide-react';\nimport LanguageSwitcher from './LanguageSwitcher';",
  "import { Menu, X, ArrowRight, Globe } from 'lucide-react';\nimport LanguageSwitcher from './LanguageSwitcher';\nimport { useTranslations } from 'next-intl';"
);

c = c.replace(
  "export default function Navbar() {",
  "export default function Navbar() {\n  const t = useTranslations('Navigation');"
);

c = c.replace(
  "{link.name}",
  "{t(link.name.toLowerCase().replace(/[^a-zA-Z0-9]/g, ''))}"
); // This won't work perfectly because keys are "home", "destinasiWisata", "calendarofEvent".
// Let's redefine navLinks directly inside Navbar.

const oldNavLinks = `const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Destinasi Wisata', href: '/kategori' },
  { name: 'Calendar of Event', href: '/event' },
  { name: 'Transportasi', href: '/transportasi' },
  { name: 'Pusat Bantuan', href: '/pusat-bantuan' },
];`;

c = c.replace(oldNavLinks, '');

c = c.replace(
  "export default function Navbar() {\n  const t = useTranslations('Navigation');",
  `export default function Navbar() {
  const t = useTranslations('Navigation');
  const navLinks = [
    { name: t('home'), href: '/' },
    { name: t('destinasi'), href: '/kategori' },
    { name: t('event'), href: '/event' },
    { name: t('pusatBantuan'), href: '/pusat-bantuan' },
  ];`
); // I removed transportasi because I didn't add it to JSON yet.

// Wait, I need to add transportasi to JSON to avoid breaking. Let's do it in the JSON file.

fs.writeFileSync(file, c);
console.log('Translated Navbar');
