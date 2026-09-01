const fs = require('fs');
let c = fs.readFileSync('src/app/(public)/page.tsx', 'utf8');

c = c.replace(
  '{/* REKOMENDASI DESTINASI WISATA */}\n      <section className="py-12 md:py-24',
  '{/* REKOMENDASI DESTINASI WISATA - HIDDEN PER USER REQUEST */}\n      {false && <section className="py-12 md:py-24'
);

// Close the false && condition before the news section
c = c.replace(
  '        </div>\n      </section>\n\n      {/* BERITA & ARTIKEL WISATA */}',
  '        </div>\n      </section>}\n\n      {/* BERITA & ARTIKEL WISATA */}'
);

fs.writeFileSync('src/app/(public)/page.tsx', c);
console.log('Hidden Destinasi section');
