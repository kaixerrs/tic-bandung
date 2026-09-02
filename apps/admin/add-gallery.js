const fs = require('fs');
let c = fs.readFileSync('src/app/(public)/page.tsx', 'utf8');

const gallerySection = `      {/* GALERI FOTO */}
      <section className="py-12 md:py-24 px-4 md:px-8 lg:px-10 max-w-[1600px] mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-20 border-b border-outline-variant/30 pb-8">
          <div>
            <span className="font-label-caps text-[14px] md:text-[18px] text-[#00C853] font-bold uppercase tracking-widest mb-4 block">Visual Kota</span>
            <h2 className="font-headline-lg text-[40px] md:text-[64px] font-black text-[#1A1A1A] uppercase tracking-widest leading-none">Galeri</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {galleries && galleries.length > 0 ? (
            galleries.map((item: any, i: number) => (
              <div key={item.id} className={\`relative group overflow-hidden rounded-3xl \${i === 0 || i === 3 ? 'md:col-span-2 lg:col-span-2 aspect-[16/9]' : 'aspect-square'} cursor-pointer shadow-sm hover:shadow-electric-yellow transition-all duration-500\`}>
                <Image 
                  fill 
                  sizes="(max-width: 768px) 100vw, 50vw" 
                  src={item.image_url} 
                  alt={item.title || 'Galeri Bandung'} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
                <div className="absolute bottom-0 left-0 p-6 md:p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="font-headline-md text-2xl md:text-3xl text-white font-bold tracking-wider mb-2">{item.title}</h3>
                  {item.description && <p className="text-white/80 font-body-md line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">{item.description}</p>}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-gray-500">Koleksi galeri belum tersedia.</div>
          )}
        </div>
      </section>
    </main>`;

c = c.replace('    </main>', gallerySection);

fs.writeFileSync('src/app/(public)/page.tsx', c);
console.log('Added Gallery Section');
