import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, Music, Film, Gamepad2, Palette, PenTool, Tv, Radio, MonitorPlay, Camera, SearchCode, Shirt, Utensils, BookOpen, Lightbulb, Building2, Brush, Newspaper } from 'lucide-react';

const SUBSECTORS = [
  { name: 'Pengembangan Permainan', icon: Gamepad2 },
  { name: 'Arsitektur', icon: Building2 },
  { name: 'Desain Interior', icon: Brush },
  { name: 'Musik', icon: Music },
  { name: 'Seni Rupa', icon: Palette },
  { name: 'Desain Produk', icon: PenTool },
  { name: 'Fesyen', icon: Shirt },
  { name: 'Kuliner', icon: Utensils },
  { name: 'Film, Animasi, dan Video', icon: Film },
  { name: 'Fotografi', icon: Camera },
  { name: 'Desain Komunikasi Visual', icon: Tv },
  { name: 'Televisi dan Radio', icon: Radio },
  { name: 'Kriya', icon: Lightbulb },
  { name: 'Periklanan', icon: MonitorPlay },
  { name: 'Seni Pertunjukan', icon: Music },
  { name: 'Penerbitan', icon: BookOpen },
  { name: 'Aplikasi', icon: SearchCode },
];

export default function EkonomiKreatifUI() {
  return (
    <main className="min-h-screen bg-[#fcf9f5]">
      
      {/* Editorial Hero */}
      <div className="relative w-full h-[60vh] md:h-[80vh] bg-black overflow-hidden flex items-center justify-center">
        <Image
          src="https://images.unsplash.com/photo-1512428559087-560fa5ceab42?q=80&w=2000"
          alt="Bandung Creative City"
          fill
          className="object-cover opacity-60"
          priority
        />
        
        {/* Typographic Overlay */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <span className="text-[#C9971E] font-bold tracking-[0.2em] uppercase text-sm md:text-base mb-4 block">
            UCCN City of Design
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-white mb-6 leading-none">
            Nadi <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C9971E] to-[#f4d17f]">Kreativitas</span><br/> Pasundan
          </h1>
          <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto font-medium">
            Mengenal 17 Sub-sektor penggerak roda ekonomi dan budaya yang menetapkan Bandung sebagai Kota Kreatif Dunia.
          </p>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 md:px-8 lg:px-12 py-16">
        
        {/* Breadcrumb */}
        <nav className="flex justify-center text-[#4f4635] text-sm mb-16 items-center gap-2 font-medium">
          <Link className="hover:text-[#7a5900] transition-colors" href="/">Beranda</Link>
          <ChevronRight className="w-4 h-4" />
          <Link className="hover:text-[#7a5900] transition-colors" href="/kategori">Kategori</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-[#1b1c1a] font-bold">Ekonomi Kreatif</span>
        </nav>

        {/* Editorial Text */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-24 items-center">
          <div className="lg:col-span-5">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-[#1b1c1a] leading-tight mb-6">
              Lebih Dari Sekadar Wisata.
            </h2>
          </div>
          <div className="lg:col-span-7 prose prose-lg text-[#4f4635] leading-relaxed">
            <p>
              Bandung tidak hanya dikenal karena keindahan alam dan warisan sejarahnya, tetapi juga sebagai kuali peleburan ide-ide segar. Sejak 2015, UNESCO menetapkan Bandung ke dalam Jaringan Kota Kreatif (UCCN) di bidang desain.
            </p>
            <p>
              Denyut nadi kota ini dijaga oleh anak-anak mudanya yang bergerak bebas di 17 sub-sektor ekonomi kreatif. Mulai dari panggung indie independen, studio animasi kelas dunia, hingga lorong-lorong distro fesyen yang mendikte tren nasional.
            </p>
          </div>
        </div>

        {/* The 17 Subsectors Grid */}
        <div className="mb-8">
          <h3 className="text-center text-sm font-bold tracking-widest uppercase text-[#C9971E] mb-12">
            17 Sub-sektor Ekonomi Kreatif
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {SUBSECTORS.map((sector, index) => {
              const Icon = sector.icon;
              return (
                <div 
                  key={index} 
                  className="bg-white aspect-square rounded-sm flex flex-col items-center justify-center p-4 text-center border border-[#d3c5af]/50 hover:border-[#C9971E] hover:shadow-[0_8px_30px_rgba(201,151,30,0.15)] transition-all duration-300 group cursor-default"
                >
                  <div className="w-12 h-12 rounded-full bg-[#f6f3f0] group-hover:bg-[#C9971E] flex items-center justify-center mb-4 transition-colors duration-300">
                    <Icon className="w-6 h-6 text-[#4f4635] group-hover:text-white transition-colors duration-300" />
                  </div>
                  <span className="font-bold text-sm text-[#1b1c1a] group-hover:text-[#C9971E] transition-colors duration-300">
                    {sector.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </main>
  );
}
