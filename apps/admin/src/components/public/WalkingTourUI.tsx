import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, Map, ArrowRight, MapPin } from 'lucide-react';

const TOUR_ROUTES = [
  {
    id: 'braga-heritage',
    title: 'Braga Heritage Walk',
    description: 'Menyusuri jalan legendaris tempat lahirnya julukan Parijs van Java.',
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1200', // Update with appropriate image
    stops: [
      {
        title: 'Titik Nol Kilometer Bandung',
        description: 'Batu penanda awal pembangunan jalan Raya Pos oleh Daendels yang menjadi cikal bakal berkembangnya kota Bandung.',
        time: '09:00',
        imageUrl: 'https://images.unsplash.com/photo-1549473889-14f410d83298?q=80&w=600'
      },
      {
        title: 'Gedung Merdeka & Museum KAA',
        description: 'Menengok kemegahan gedung tempat berlangsungnya Konferensi Asia Afrika tahun 1955.',
        time: '09:45',
        imageUrl: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?q=80&w=600'
      },
      {
        title: 'Jalan Braga (Bragaweg)',
        description: 'Berjalan santai menikmati fasad bangunan Art Deco peninggalan Belanda, mampir ke toko roti jadul dan galeri lukisan jalanan.',
        time: '11:00',
        imageUrl: 'https://images.unsplash.com/photo-1555018617-1fdf5b1ceeb1?q=80&w=600'
      }
    ]
  }
];

export default function WalkingTourUI() {
  const route = TOUR_ROUTES[0]; // For MVP, we render the first route

  return (
    <main className="min-h-screen bg-[#fcf9f5]">
      
      <div className="bg-[#1b1c1a] pt-32 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/60 z-10 pointer-events-none"></div>
        <Image
          src={route.image}
          alt={route.title}
          fill
          className="object-cover opacity-50 grayscale hover:grayscale-0 transition-all duration-1000"
          priority
        />
        
        <div className="max-w-[1000px] mx-auto px-4 md:px-8 relative z-20 text-center">
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-white/90 text-sm font-medium mb-6 border border-white/20 uppercase tracking-widest">
            <Map className="w-4 h-4" /> Historical Walking Tour
          </span>
          <h1 className="text-4xl md:text-6xl font-bold font-display text-white mb-6">
            Menyelami Sejarah,<br/>Satu Langkah Sekaligus.
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Rasakan magisnya kota Bandung dengan menyusuri rute-rute bersejarah jalan kakinya. Panduan rute terkurasi untuk perjalanan waktu Anda.
          </p>
        </div>
      </div>

      <div className="max-w-[1000px] mx-auto px-4 md:px-8 py-16">
        
        {/* Breadcrumb */}
        <nav className="flex text-[#4f4635] text-sm mb-12 items-center gap-2 font-medium">
          <Link className="hover:text-[#8C5A3C] transition-colors" href="/">Beranda</Link>
          <ChevronRight className="w-4 h-4" />
          <Link className="hover:text-[#8C5A3C] transition-colors" href="/kategori">Kategori</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-[#1b1c1a] font-bold">Walking Tour</span>
        </nav>

        {/* Route Details */}
        <div className="bg-white rounded-sm shadow-xl p-8 md:p-12 border border-[#d3c5af]/50">
          
          <div className="text-center mb-16 border-b border-[#f6f3f0] pb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-[#1b1c1a] mb-4">{route.title}</h2>
            <p className="text-[#4f4635] text-lg max-w-xl mx-auto">{route.description}</p>
          </div>

          {/* Timeline Route */}
          <div className="relative max-w-3xl mx-auto">
            {/* Center Line for Desktop, Left Line for Mobile */}
            <div className="absolute left-8 md:left-1/2 top-4 bottom-4 w-1 bg-[#d3c5af]/30 -translate-x-1/2 rounded-full"></div>

            {route.stops.map((stop, idx) => {
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
                    <h3 className="text-2xl font-bold text-[#1b1c1a] mb-3 leading-tight">{stop.title}</h3>
                    <p className="text-[#4f4635] leading-relaxed">{stop.description}</p>
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
