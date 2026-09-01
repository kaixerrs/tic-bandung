import Link from 'next/link';
import { ModernHero } from '@/components/ui/ModernHero';
import { ChevronRight, Bed, Map, Coffee, Compass } from 'lucide-react';
import { Montserrat } from 'next/font/google';
import { ScrollReveal } from '@/components/ui/animations/ScrollReveal';

const montserrat = Montserrat({ subsets: ['latin'], weight: ['400', '700', '900'] });

export const metadata = {
  title: 'Kategori Wisata | TIC Kota Bandung',
  description: 'Jelajahi beragam kategori destinasi wisata di Kota Bandung.',
};

import { createClient } from '@/utils/supabase/server';

export default async function KategoriPage() {
  const supabase = await createClient();
  const { data: stats } = await supabase.from('category_stats_view').select('*');
  const { data: categories } = await supabase.from('categories').select('id, name, slug, image_url, pillar');

  const getImage = (slug: string) => {
    if (!categories) return null;
    const category = categories.find(c => c.slug === slug || c.slug.includes(slug) || slug.includes(c.slug));
    return category?.image_url || null;
  };

  const renderBg = (slug: string) => {
    const img = getImage(slug);
    if (img) return <img src={img} alt="" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700" />;
    return null;
  };
  
  const getCount = (slug: string, fallback: string) => {
    if (!stats) return fallback;
    const category = stats.find(s => s.slug === slug);
    return category ? `${category.total_published_locations} Lokasi` : fallback;
  };

  return (
    <main className="w-full bg-[#fcf9f5] min-h-screen overflow-x-hidden">
      <ModernHero 
        breadcrumbText="Destinasi Wisata"
        title="Eksplorasi Kota"
        highlightText="Bandung"
        highlightGradient="from-[#3D7A5E] to-[#519f7b]"
        description="Temukan beragam pesona Kota Bandung melalui panduan destinasi pilihan kami yang terbagi dalam tiga pilar utama pengalaman wisata."
        layoutVariant="left"
        illustration={
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="absolute w-[120%] h-[120%] bg-[#3D7A5E]/20 rounded-full blur-3xl mix-blend-multiply animate-pulse"></div>
            <div className="relative bg-white/40 backdrop-blur-xl border border-white/60 p-8 rounded-[3rem] shadow-2xl rotate-3 hover:rotate-6 transition-all duration-500">
              <Compass className="w-48 h-48 text-[#3D7A5E] drop-shadow-xl" strokeWidth={1.5} />
            </div>
          </div>
        }
      />

      {/* Elegant Separator */}
      <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12">
        <div className="w-full h-[1px] bg-gradient-to-r from-slate-200 via-slate-300 to-transparent my-4"></div>
      </div>

      {/* Body Section */}
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 py-12">

                {/* PILLAR 1: Where to Stay & Relax */}
        {categories && categories.filter(c => c.pillar === 'stay').length > 0 && (
        <ScrollReveal>
<section className="mb-20">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-[#2C5C8A]/10 rounded-xl flex items-center justify-center">
              <Bed className="w-6 h-6 text-[#2C5C8A]" />
            </div>
            <div>
              <h2 className={`${montserrat.className} text-3xl font-bold text-slate-900`}>Where to Stay & Relax</h2>
              <p className="text-slate-600">Hotel, Spa, dan Pariwisata Medis</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 auto-rows-[160px] md:auto-rows-[250px]">
            {categories?.filter(c => c.pillar === 'stay').map(cat => (
              <Link key={cat.id} href={`/kategori/${cat.slug}`} className="relative rounded-sm md:rounded-sm overflow-hidden group cursor-pointer shadow-sm bg-slate-800">
                {renderBg(cat.slug)}
                <div className="absolute inset-0 bg-[#2C5C8A]/20 transition-colors duration-700 group-hover:bg-[#2C5C8A]/40"></div>
                <div className="absolute inset-0 p-3 md:p-6 flex flex-col justify-end z-10">
                  <span className="bg-[#2C5C8A] text-white text-[9px] md:text-xs font-bold px-2 py-0.5 md:px-3 md:py-1 rounded-full w-max mb-1 md:mb-2">{getCount(cat.slug, '0 Lokasi')}</span>
                  <h3 className="text-sm md:text-2xl font-bold text-white leading-tight">{cat.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
        </ScrollReveal>
        )}

        {/* PILLAR 2: Things to Do & Explore */}
        {categories && categories.filter(c => c.pillar === 'explore').length > 0 && (
        <ScrollReveal delay={0.1}>
        <section className="mb-20">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-[#3D7A5E]/10 rounded-xl flex items-center justify-center">
              <Map className="w-6 h-6 text-[#3D7A5E]" />
            </div>
            <div>
              <h2 className={`${montserrat.className} text-3xl font-bold text-[#1b1c1a]`}>Things to Do & Explore</h2>
              <p className="text-[#4f4635]">Rekreasi, Sejarah, Seni, Religi, Olahraga & Walking Tour</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 auto-rows-[150px] md:auto-rows-[220px]">
            {categories?.filter(c => c.pillar === 'explore').map(cat => (
              <Link key={cat.id} href={`/kategori/${cat.slug}`} className="relative rounded-sm md:rounded-sm overflow-hidden group cursor-pointer shadow-sm bg-[#1b1c1a]">
                {renderBg(cat.slug)}
                <div className="absolute inset-0 bg-[#3D7A5E]/30 transition-colors duration-700 group-hover:bg-[#3D7A5E]/50"></div>
                <div className="absolute inset-0 p-3 md:p-6 flex flex-col justify-end z-10">
                  <span className="bg-[#3D7A5E] text-white text-[9px] md:text-xs font-bold px-2 py-0.5 md:px-3 md:py-1 rounded-full w-max mb-1 md:mb-2">{getCount(cat.slug, '0 Lokasi')}</span>
                  <h3 className="text-sm md:text-xl font-bold text-white leading-tight">{cat.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
        </ScrollReveal>
        )}

        {/* PILLAR 3: Lifestyle, Eat & Space */}
        {categories && categories.filter(c => c.pillar === 'lifestyle').length > 0 && (
        <section className="mb-20">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-[#C9971E]/10 rounded-xl flex items-center justify-center">
              <Coffee className="w-6 h-6 text-[#C9971E]" />
            </div>
            <div>
              <h2 className={`${montserrat.className} text-3xl font-bold text-[#1b1c1a]`}>Lifestyle, Eat & Space</h2>
              <p className="text-[#4f4635]">Kuliner, Belanja, Kampung Kreatif & Co-Working Space</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 auto-rows-[180px] md:auto-rows-[280px]">
            {categories?.filter(c => c.pillar === 'lifestyle').map(cat => (
              <Link key={cat.id} href={`/kategori/${cat.slug}`} className="relative rounded-sm md:rounded-sm overflow-hidden group cursor-pointer shadow-sm bg-[#3a352a]">
                {renderBg(cat.slug)}
                <div className="absolute inset-0 bg-[#2b271d]/40 transition-colors duration-700 group-hover:bg-[#1b1c1a]/60"></div>
                <div className="absolute inset-0 p-3 md:p-6 flex flex-col justify-end z-10">
                  <span className="bg-[#C9971E] text-[#1b1c1a] text-xs font-bold px-3 py-1 rounded-full w-max mb-2">{getCount(cat.slug, '0 Lokasi')}</span>
                  <h3 className="text-sm md:text-2xl font-bold text-white leading-tight">{cat.name}</h3>
                </div>
              </Link>
            ))} 
          </div>
        </section>
        )}
      </div>
    </main>
  );
}






