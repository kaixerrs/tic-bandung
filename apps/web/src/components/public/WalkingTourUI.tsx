import Image from 'next/image';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { ChevronRight, Map, ArrowRight, MapPin } from 'lucide-react';

const TOUR_ROUTES: any[] = [
  {
    id: 'braga-heritage',
    title: { id: 'Braga Heritage Walk', en: 'Braga Heritage Walk' },
    description: { 
      id: 'Menyusuri jalan legendaris tempat lahirnya julukan Parijs van Java.', 
      en: 'Stroll down the legendary street where the nickname Parijs van Java was born.' 
    },
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1200',
    stops: [
      {
        title: { id: 'Titik Nol Kilometer Bandung', en: 'Bandung Zero Kilometer Point' },
        description: { 
          id: 'Batu penanda awal pembangunan jalan Raya Pos oleh Daendels yang menjadi cikal bakal berkembangnya kota Bandung.', 
          en: "The initial marker of the Great Post Road construction by Daendels, which became the forerunner of Bandung's development." 
        },
        time: '09:00',
        imageUrl: 'https://images.unsplash.com/photo-1549473889-14f410d83298?q=80&w=600'
      },
      {
        title: { id: 'Gedung Merdeka & Museum KAA', en: 'Gedung Merdeka & KAA Museum' },
        description: { 
          id: 'Menengok kemegahan gedung tempat berlangsungnya Konferensi Asia Afrika tahun 1955.', 
          en: 'Look at the grandeur of the building where the Asian-African Conference took place in 1955.' 
        },
        time: '09:45',
        imageUrl: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?q=80&w=600'
      },
      {
        title: { id: 'Jalan Braga (Bragaweg)', en: 'Braga Street (Bragaweg)' },
        description: { 
          id: 'Berjalan santai menikmati fasad bangunan Art Deco peninggalan Belanda, mampir ke toko roti jadul dan galeri lukisan jalanan.', 
          en: 'Take a leisurely walk enjoying the Dutch Art Deco building facades, stop by an old-school bakery and street painting galleries.' 
        },
        time: '11:00',
        imageUrl: 'https://images.unsplash.com/photo-1555018617-1fdf5b1ceeb1?q=80&w=600'
      }
    ]
  }
];

export default function WalkingTourUI() {
  const locale = useLocale();
  const l = (id: string, en: string) => locale === 'en' ? en : id; 
  const t = useTranslations('Walking');
  const route = TOUR_ROUTES[0]; // For MVP, we render the first route

  return (
    <main className="min-h-screen bg-[#fcf9f5]">
      
      <div className="bg-[#1b1c1a] pt-32 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/60 z-10 pointer-events-none"></div>
        <Image
          src={route.image}
          alt={locale === 'en' ? route.title.en : route.title.id}
          fill
          className="object-cover opacity-50 grayscale hover:grayscale-0 transition-all duration-1000"
          priority
        />
        
        <div className="max-w-[1000px] mx-auto px-4 md:px-8 relative z-20 text-center">
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-white/90 text-sm font-medium mb-6 border border-white/20 uppercase tracking-widest">
            <Map className="w-4 h-4" /> {l('Historical Walking Tour', 'Historical Walking Tour')}
          </span>
          <h1 className="text-4xl md:text-6xl font-bold font-display text-white mb-6">
            {l('Menyelami Sejarah,', 'Dive Into History,')}<br/>{l('Satu Langkah Sekaligus.', 'One Step at a Time.')}
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            {l('Rasakan magisnya kota Bandung dengan menyusuri rute-rute bersejarah jalan kakinya. Panduan rute terkurasi untuk perjalanan waktu Anda.', 'Experience the magic of Bandung by strolling along its historic routes. Curated walking guides for your time travel.')}
          </p>
        </div>
      </div>

      <div className="max-w-[1000px] mx-auto px-4 md:px-8 py-16">
        
        {/* Breadcrumb */}
        <nav className="flex text-[#4f4635] text-sm mb-12 items-center gap-2 font-medium">
          <Link className="hover:text-[#8C5A3C] transition-colors" href="/">{l('Beranda', 'Home')}</Link>
          <ChevronRight className="w-4 h-4" />
          <Link className="hover:text-[#8C5A3C] transition-colors" href="/kategori">{l('Kategori', 'Category')}</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-[#1b1c1a] font-bold">{t('title')}</span>
        </nav>

        {/* Route Details */}
        <div className="bg-white rounded-sm shadow-xl p-8 md:p-12 border border-[#d3c5af]/50">
          
          <div className="text-center mb-16 border-b border-[#f6f3f0] pb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-[#1b1c1a] mb-4">{locale === 'en' ? route.title.en : route.title.id}</h2>
            <p className="text-[#4f4635] text-lg max-w-xl mx-auto">{locale === 'en' ? route.description.en : route.description.id}</p>
          </div>

          {/* Timeline Route */}
          <div className="relative max-w-3xl mx-auto">
            {/* Center Line for Desktop, Left Line for Mobile */}
            <div className="absolute left-8 md:left-1/2 top-4 bottom-4 w-1 bg-[#d3c5af]/30 -translate-x-1/2 rounded-full"></div>

            {route.stops.map((stop: any, idx: number) => {
              const isEven = idx % 2 === 0;
              return (
                <div key={idx} className={`relative flex flex-col md:flex-row items-center gap-8 md:gap-16 mb-16 ${isEven ? 'md:flex-row-reverse' : ''}`}>
                  
                  {/* Timeline Dot */}
                  <div className="absolute left-8 md:left-1/2 w-10 h-10 rounded-full border-4 border-white bg-[#8C5A3C] shadow-md -translate-x-1/2 flex items-center justify-center text-white font-bold z-10 text-sm">
                    {idx + 1}
                  </div>

                  {/* Content (Text) */}
                  <div className={`w-full md:w-1/2 pl-20 md:pl-0 ${isEven ? 'md:pr-16 md:text-right' : 'md:pl-16 md:text-left'}`}>
                    <span className="text-[#8C5A3C] font-bold text-sm tracking-widest mb-2 block">{stop.time}</span>
                    <h3 className="text-2xl font-bold text-[#1b1c1a] mb-3 leading-tight">{locale === 'en' ? stop.title.en : stop.title.id}</h3>
                    <p className="text-[#4f4635] leading-relaxed">{locale === 'en' ? stop.description.en : stop.description.id}</p>
                  </div>

                  {/* Visual (Image) */}
                  <div className={`w-full md:w-1/2 pl-20 md:pl-0 ${isEven ? 'md:pl-16' : 'md:pr-16'}`}>
                    <div className="relative h-64 w-full rounded-sm overflow-hidden shadow-[0_8px_30px_rgba(42,42,40,0.08)] group">
                      <Image
                        src={stop.imageUrl}
                        alt={stop.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500"></div>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

        </div>

      </div>
    </main>
  );
}
