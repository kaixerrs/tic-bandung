import Link from 'next/link';
import Image from 'next/image';
import { ModernHero } from '@/components/ui/ModernHero';
import { ArrowRight, Bus, Train, Plane, Bike, CarTaxiFront, ExternalLink, Map, Info, ChevronRight } from 'lucide-react';
import { Montserrat } from 'next/font/google';
import { ScrollReveal } from '@/components/ui/animations/ScrollReveal';

const montserrat = Montserrat({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'] });

export const metadata = {
  title: 'Panduan Transportasi | TIC Kota Bandung',
  description: 'Informasi lengkap rute angkutan umum, transportasi online, dan mobilitas di Kota Bandung.',
};

export default function TransportasiPage() {
  return (
    <main className="w-full bg-[#f8f9fa] min-h-screen pb-32 overflow-hidden selection:bg-blue-100">
      
<ModernHero 
        breadcrumbText="Transportasi"
        title="Jelajahi Bandung"
        highlightText="Tanpa Batas."
        highlightGradient="from-blue-600 to-blue-400"
        description="Sistem transportasi terintegrasi untuk kenyamanan perjalanan Anda. Dari kereta cepat hingga sepeda santai keliling kota."
        layoutVariant="left"
        illustration={
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="absolute w-[120%] h-[120%] bg-blue-500/20 rounded-full blur-3xl mix-blend-multiply animate-pulse delay-500"></div>
            <div className="relative bg-white/40 backdrop-blur-xl border border-white/60 p-8 rounded-[3rem] shadow-2xl rotate-3 hover:rotate-6 transition-all duration-500">
              <Bus className="w-48 h-48 text-blue-500 drop-shadow-xl" strokeWidth={1.5} />
            </div>
          </div>
        }
      />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        
        {/* Modern Bento Grid Layout */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 auto-rows-[minmax(160px,auto)] md:auto-rows-[300px]">
          
          {/* Card 1: Whoosh (Image Card) */}
          <ScrollReveal className="md:col-span-2 h-full">
          <div className="bg-slate-900 h-full rounded-sm md:rounded-[32px] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.04)] group relative">
            <Image fill sizes="(max-width: 768px) 100vw, 50vw" src="/ASET VISUAL/Whoosh.jpg" className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700" alt="Kereta Cepat Whoosh" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/10 to-transparent"></div>
            
            <div className="absolute inset-0 p-4 md:p-10 flex flex-col justify-end">
              <div className="inline-flex items-center justify-center w-max px-2 py-0.5 md:px-3 md:py-1 bg-blue-600 text-white text-[9px] md:text-xs font-bold rounded-full mb-2 md:mb-4 uppercase tracking-wider">
                Kereta Cepat
              </div>
              <h2 className="text-lg md:text-3xl font-bold text-white mb-1 md:mb-2 tracking-tight">Whoosh</h2>
              <p className="text-slate-300 font-medium leading-relaxed max-w-md text-[10px] md:text-base hidden md:block">
                Jakarta - Bandung dalam 45 menit. Terkoneksi langsung dengan KA Feeder ke pusat kota.
              </p>
              <Link href="https://kcic.co.id" className="inline-flex items-center gap-1 md:gap-2 text-white font-bold mt-1 md:mt-4 text-[10px] md:text-base group-hover:gap-3 transition-all hover:text-blue-300">
                Jadwal & Tiket <ArrowRight className="w-5 h-5"/>
              </Link>
            </div>
          </div>
          </ScrollReveal>

          {/* Card 2: Bandros (Image Card) */}
          <div className="md:col-span-2 bg-slate-900 rounded-sm md:rounded-[32px] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.04)] group relative">
            <Image fill sizes="(max-width: 768px) 100vw, 50vw" src="/ASET VISUAL/bandros.jpg" className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700" alt="Bandros" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/10 to-transparent"></div>
            
            <div className="absolute inset-0 p-4 md:p-10 flex flex-col justify-end">
              <div className="inline-flex items-center justify-center w-max px-2 py-0.5 md:px-3 md:py-1 bg-amber-500 text-white text-[9px] md:text-xs font-bold rounded-full mb-1 md:mb-4 uppercase tracking-wider">
                Ikonik
              </div>
              <h2 className="text-lg md:text-3xl font-bold text-white mb-1 md:mb-2 tracking-tight">Bandros</h2>
              <p className="text-slate-300 font-medium leading-relaxed max-w-md text-[10px] md:text-base hidden md:block">
                Bus wisata tematik untuk berkeliling landmark bersejarah Kota Bandung.
              </p>
              <Link href="https://uptangkutan-bandung.id/bandros/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 md:gap-2 text-white font-bold mt-2 md:mt-4 text-[10px] md:text-base group-hover:gap-3 transition-all hover:text-amber-300">
                Jadwal & Rute <ArrowRight className="w-5 h-5"/>
              </Link>
            </div>
          </div>

          {/* Card 3: Transportasi Online (Image Card) */}
          <div className="lg:col-span-1 bg-slate-900 rounded-sm md:rounded-[32px] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-500 group relative">
            <Image fill sizes="(max-width: 768px) 100vw, 50vw" src="/ASET VISUAL/transportasi-online.jpg" className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700" alt="Transportasi Online" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent"></div>
            
            <div className="absolute inset-0 p-4 md:p-8 flex flex-col justify-end">
              <div className="inline-flex items-center justify-center w-max px-2 py-0.5 md:px-3 md:py-1 bg-emerald-600 text-white text-[9px] md:text-xs font-bold rounded-full mb-1 md:mb-3 uppercase tracking-wider">
                Ride Hailing
              </div>
              <h3 className="text-sm md:text-xl font-bold text-white mb-1 md:mb-2 leading-tight">Transportasi Online</h3>
              <p className="text-slate-300 text-sm leading-relaxed hidden md:block">
                Tersedia 24 jam. Patuhi aturan titik jemput khusus (Shelter) di stasiun.
              </p>
            </div>
          </div>

          {/* Card 4: Boseh (Image Card) */}
          <div className="lg:col-span-1 bg-slate-900 rounded-sm md:rounded-[32px] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-500 group relative">
            <Image fill sizes="(max-width: 768px) 100vw, 50vw" src="/ASET VISUAL/boseh.jpg" className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700" alt="Boseh Bike Sharing" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent"></div>
            
            <div className="absolute inset-0 p-4 md:p-8 flex flex-col justify-end">
              <div className="inline-flex items-center justify-center w-max px-2 py-0.5 md:px-3 md:py-1 bg-purple-600 text-white text-[9px] md:text-xs font-bold rounded-full mb-1 md:mb-3 uppercase tracking-wider">
                Sepeda Publik
              </div>
              <h3 className="text-sm md:text-xl font-bold text-white mb-1 md:mb-2">Boseh</h3>
              <p className="text-slate-300 text-sm leading-relaxed hidden md:block">
                Sewa sepeda di titik strategis. Cara terseru menikmati kota.
              </p>
              <Link href="https://uptangkutan-bandung.id/boseh" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 md:gap-2 text-white font-bold mt-1 md:mt-4 text-[10px] md:text-sm group-hover:gap-3 transition-all hover:text-purple-300">
                Info Lengkap <ArrowRight className="w-5 h-5"/>
              </Link>
            </div>
          </div>

          {/* Card 5: DAMRI & Angkot */}
          <div className="col-span-2 md:col-span-2 bg-white rounded-sm md:rounded-[32px] p-5 md:p-10 border border-slate-100/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-500 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-50 rounded-bl-[100px] -z-10 transition-transform group-hover:scale-110"></div>
            <div className="flex flex-col h-full justify-between">
              <div>
                <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-8">
                  <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-sm flex items-center justify-center">
                    <Bus className="w-6 h-6"/>
                  </div>
                  <h3 className="text-lg md:text-2xl font-bold text-slate-900">DAMRI & Angkot</h3>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-8">
                  <div>
                    <h4 className="font-bold text-slate-900 mb-2">Trans Metro Bandung</h4>
                    <p className="text-slate-500 text-sm leading-relaxed">Bus koridor utama berbasis non-tunai (QRIS/E-Money) antar pusat keramaian.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-2">Angkutan Kota</h4>
                    <p className="text-slate-500 text-sm leading-relaxed">Urat nadi mobilitas warga. Menjangkau seluruh pelosok dengan tarif sangat terjangkau.</p>
                  </div>
                </div>
              </div>
              
              
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}



