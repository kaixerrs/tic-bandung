const fs = require('fs');
const file = 'src/components/public/Navbar.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(
  `  const navLinks = [
    { name: t('home'), href: '/' },
    { name: t('destinasi'), href: '/kategori' },
    { name: t('event'), href: '/event' },
    { name: t('pusatBantuan'), href: '/pusat-bantuan' },
  ];`,
  `  const navLinks = [
    { name: t('home'), href: '/' },
    { name: t('destinasi'), href: '/kategori' },
    { name: t('event'), href: '/event' },
    { name: t('transportasi'), href: '/transportasi' },
    { name: t('pusatBantuan'), href: '/pusat-bantuan' },
  ];`
);

fs.writeFileSync(file, c);
console.log('Fixed Navbar 2');
