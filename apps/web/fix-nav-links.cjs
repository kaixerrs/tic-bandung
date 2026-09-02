const fs = require("fs");
let p = "src/components/public/Navbar.tsx";
let c = fs.readFileSync(p, "utf8");

// Change navLinks array logic inside the component
c = c.replace(
  /const navLinks = \[\s+\{ id: 'home', name: t\('home'\), href: '\/' \},\s+\{ id: 'destinasi', name: t\('destinasi'\), href: '\/kategori' \},\s+\{ id: 'event', name: t\('event'\), href: '\/event' \},\s+\{ id: 'transportasi', name: t\('transportasi'\), href: '\/transportasi' \},\s+\{ id: 'pusatBantuan', name: t\('pusatBantuan'\), href: '\/pusat-bantuan' \},\s+\];/,
  `const getHref = (path) => locale === 'en' ? '/en' + (path === '/' ? '' : path) : path;
  const navLinks = [
    { id: 'home', name: t('home'), href: getHref('/') },
    { id: 'destinasi', name: t('destinasi'), href: getHref('/kategori') },
    { id: 'event', name: t('event'), href: getHref('/event') },
    { id: 'transportasi', name: t('transportasi'), href: getHref('/transportasi') },
    { id: 'pusatBantuan', name: t('pusatBantuan'), href: getHref('/pusat-bantuan') },
  ];`
);

// Fix Paket Wisata desktop button
c = c.replace(
  /href="\/paket-wisata"/g,
  'href={locale === \'en\' ? \'/en/paket-wisata\' : \'/paket-wisata\'}'
);

fs.writeFileSync(p, c, "utf8");
console.log("Navbar links fixed");
