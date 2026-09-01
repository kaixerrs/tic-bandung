import { Montserrat } from 'next/font/google';
import { ScrollReveal } from '@/components/ui/animations/ScrollReveal';
import Link from 'next/link';
import Image from 'next/image';
import { ModernHero } from '@/components/ui/ModernHero';
import { ChevronRight, ExternalLink, ShieldCheck, Compass, Users, CheckCircle2, Building, TreePine, Camera } from 'lucide-react';

const montserrat = Montserrat({ subsets: ['latin'], weight: ['400', '700', '900'] });

export const metadata = {
  title: 'Paket Wisata | TIC Kota Bandung',
  description: 'Pilihan paket wisata resmi dari asosiasi ASTINDO dan ASITA.',
};

export default function PaketWisataPage() {
  return (
    <main className="w-full bg-[#fcf9f5] min-h-screen overflow-hidden">
      

      <ModernHero 
        breadcrumbText="Paket Wisata"
        title="Jelajahi Bandung"
        highlightText="Tanpa Beban."
        description="Nikmati kemudahan menjelajahi Kota Bandung dengan pilihan paket wisata eksklusif, terpercaya, dan bersertifikat dari asosiasi resmi pariwisata."
      />

      {/* Association Cards Section */}
      <section className="relative z-20 w-full max-w-[1600px] px-4 md:px-8 lg:px-12 mx-auto pb-16 md:pb-32 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          
          {/* ASITA Card */}
          <div className="group relative bg-white/70 backdrop-blur-xl rounded-[1.5rem] md:rounded-[2.5rem] p-5 md:p-12 border border-white shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden flex flex-col h-full animate-fade-up-delay-1">
            {/* Decorative background logo/icon */}
            <Compass className="absolute -bottom-10 -right-10 w-64 h-64 text-blue-500/5 group-hover:text-blue-500/10 group-hover:scale-110 transition-all duration-700 pointer-events-none rotate-12" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/20 rounded-full blur-[50px]"></div>

            <div className="relative z-10 flex-grow">
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 md:w-24 md:h-24 bg-white/80 backdrop-blur-md rounded-sm md:rounded-sm flex items-center justify-center p-3 shadow-lg shadow-blue-500/10 border border-white/60 group-hover:rotate-3 group-hover:scale-105 transition-all duration-500">
                    <Image src="/logo/asita-logo.png" alt="ASITA Logo" width={80} height={80} className="object-contain" />
                  </div>
                  <div>
                    <h2 className={`${montserrat.className} text-xl md:text-3xl font-bold text-slate-900 mb-1`}>ASITA</h2>
                    <span className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">Jawa Barat</span>
                  </div>
                </div>
              </div>
              
              <p className="text-slate-600 leading-relaxed mb-4 md:mb-8 text-sm md:text-lg">
                Temukan beragam paket perjalanan wisata menarik yang diselenggarakan oleh agen perjalanan terpercaya di bawah naungan ASITA. Mulai dari city tour, wisata alam, hingga wisata edukasi.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 md:mb-10">
                <div className="bg-white/80 p-5 rounded-sm border border-slate-100 shadow-sm flex items-start gap-3">
                  <Building className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm mb-1">City & Heritage Tour</h4>
                    <p className="text-xs text-slate-500">Jelajahi sejarah di Kota Bandung</p>
                  </div>
                </div>
                <div className="bg-white/80 p-5 rounded-sm border border-slate-100 shadow-sm flex items-start gap-3">
                  <TreePine className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm mb-1">Nature Gateway</h4>
                    <p className="text-xs text-slate-500">Lembang, Ciwidey & Pangalengan</p>
                  </div>
                </div>
              </div>
            </div>

            <Link 
              href="https://www.asita-jabar.org/" 
              target="_blank"
              className="relative z-10 flex items-center justify-between bg-slate-900 text-white w-full px-8 py-5 rounded-sm font-bold overflow-hidden group/btn"
            >
              <div className="absolute inset-0 bg-blue-600 translate-y-[100%] group-hover/btn:translate-y-0 transition-transform duration-500 ease-in-out"></div>
              <span className="relative z-10">Lihat Katalog ASITA</span>
              <div className="relative z-10 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center group-hover/btn:bg-white group-hover/btn:text-blue-600 transition-colors duration-500">
                <ExternalLink className="w-5 h-5 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          </div>

          {/* ASTINDO Card */}
          <div className="group relative bg-white/70 backdrop-blur-xl rounded-[1.5rem] md:rounded-[2.5rem] p-5 md:p-12 border border-white shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden flex flex-col h-full animate-fade-up-delay-2">
            {/* Decorative background logo/icon */}
            <Users className="absolute -bottom-10 -right-10 w-64 h-64 text-emerald-500/5 group-hover:text-emerald-500/10 group-hover:scale-110 transition-all duration-700 pointer-events-none -rotate-12" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/20 rounded-full blur-[50px]"></div>

            <div className="relative z-10 flex-grow">
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 md:w-24 md:h-24 bg-white/80 backdrop-blur-md rounded-sm md:rounded-sm flex items-center justify-center p-3 shadow-lg shadow-emerald-500/10 border border-white/60 group-hover:-rotate-3 group-hover:scale-105 transition-all duration-500">
                    <Image src="/logo/astindo.png" alt="ASTINDO Logo" width={80} height={80} className="object-contain" />
                  </div>
                  <div>
                    <h2 className={`${montserrat.className} text-xl md:text-3xl font-bold text-slate-900 mb-1`}>ASTINDO</h2>
                    <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">Nasional</span>
                  </div>
                </div>
              </div>
              
              <p className="text-slate-600 leading-relaxed mb-4 md:mb-8 text-sm md:text-lg">
                Pilihan paket tur eksklusif, perjalanan korporat, hingga kegiatan MICE (Meeting, Incentive, Convention, Exhibition) dari jaringan travel agent profesional tersertifikasi ASTINDO.
              </p>
              
              <div className="flex flex-col gap-2 md:gap-3 mb-6 md:mb-10">
                <div className="flex items-center gap-3 bg-white/80 p-3 rounded-xl border border-slate-100">
                  <CheckCircle2 className="w-5 h-5 text-[#C9971E]" />
                  <span className="text-slate-700 font-medium text-sm">Paket Wisata Keluarga Premium</span>
                </div>
                <div className="flex items-center gap-3 bg-white/80 p-3 rounded-xl border border-slate-100">
                  <CheckCircle2 className="w-5 h-5 text-[#C9971E]" />
                  <span className="text-slate-700 font-medium text-sm">Perjalanan Bisnis & Corporate Gathering</span>
                </div>
                <div className="flex items-center gap-3 bg-white/80 p-3 rounded-xl border border-slate-100">
                  <CheckCircle2 className="w-5 h-5 text-[#C9971E]" />
                  <span className="text-slate-700 font-medium text-sm">Customized Tour & MICE Packages</span>
                </div>
              </div>
            </div>

            <Link 
              href="https://astindo.org/" 
              target="_blank"
              className="relative z-10 flex items-center justify-between bg-slate-900 text-white w-full px-8 py-5 rounded-sm font-bold overflow-hidden group/btn"
            >
              <div className="absolute inset-0 bg-emerald-600 translate-y-[100%] group-hover/btn:translate-y-0 transition-transform duration-500 ease-in-out"></div>
              <span className="relative z-10">Lihat Katalog ASTINDO</span>
              <div className="relative z-10 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center group-hover/btn:bg-white group-hover/btn:text-emerald-600 transition-colors duration-500">
                <ExternalLink className="w-5 h-5 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          </div>

        </div>
      </section>

      {/* CTA Bottom */}
      <section className="w-full max-w-[1600px] px-4 md:px-8 lg:px-12 mx-auto pb-16 md:pb-32">
        <div className="bg-slate-900 rounded-[1.5rem] md:rounded-[3rem] overflow-hidden relative flex flex-col md:flex-row items-center justify-between p-6 md:p-16 lg:px-24">
          <div className="absolute inset-0 z-0">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#C9971E]/20 rounded-full blur-[100px] mix-blend-screen -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#3D7A5E]/20 rounded-full blur-[100px] mix-blend-screen translate-y-1/2 -translate-x-1/2"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
          </div>
          
          <div className="relative z-10 max-w-2xl text-center md:text-left mb-10 md:mb-0">
            <h2 className={`${montserrat.className} text-2xl md:text-5xl font-bold text-white mb-4 md:mb-6 leading-tight`}>
              Butuh panduan destinasi <br/> sebelum memesan?
            </h2>
            <p className="text-slate-300 text-sm md:text-xl font-light">
              Temukan referensi tempat wisata terbaik, galeri visual, dan kalender acara di Kota Bandung.
            </p>
          </div>
          
          <div className="relative z-10 flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <Link 
              href="/destinasi" 
              className="bg-[#C9971E] hover:bg-[#b0831a] text-white px-6 py-3 md:px-8 md:py-4 rounded-xl text-sm md:text-base font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-[#C9971E]/30"
            >
              Jelajahi Destinasi
              <ChevronRight className="w-5 h-5" />
            </Link>
            <Link 
              href="/galeri" 
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3 md:px-8 md:py-4 rounded-xl text-sm md:text-base font-bold flex items-center justify-center gap-2 transition-colors backdrop-blur-md"
            >
              <Camera className="w-5 h-5" />
              Lihat Galeri
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}





