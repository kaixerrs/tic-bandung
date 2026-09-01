import { Metadata } from 'next';
import { Phone, MapPin, Mail, AlertTriangle, MessageCircle, Clock, Globe, ArrowUpRight, ShieldAlert, HeartPulse, Flame } from 'lucide-react';
import FAQSection from '@/components/home/FAQSection';
import { getSiteSettings } from '@/app/actions/cmsActions';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Pusat Bantuan - TIC Kota Bandung',
  description: 'Informasi darurat, kontak resmi, dan FAQ Tourist Information Center Kota Bandung.',
};

import DestinationMapWrapper from '@/components/public/DestinationMapWrapper';

export default async function PusatBantuanPage() {
  const settings = await getSiteSettings();

  const emergencyContacts = [
    {
      title: 'Polisi',
      number: settings?.emergency_police || '110',
      description: 'Keamanan & Kriminalitas',
      icon: <ShieldAlert className="w-8 h-8 text-white" />,
      bgColor: 'bg-blue-500 hover:bg-blue-600',
      shadowHover: 'hover:shadow-[0_10px_30px_rgba(59,130,246,0.4)]'
    },
    {
      title: 'Ambulans',
      number: settings?.emergency_ambulance || '119',
      description: 'Gawat Darurat Medis',
      icon: <HeartPulse className="w-8 h-8 text-white" />,
      bgColor: 'bg-red-500 hover:bg-red-600',
      shadowHover: 'hover:shadow-[0_10px_30px_rgba(239,68,68,0.4)]'
    },
    {
      title: 'Pemadam',
      number: settings?.emergency_fire || '113',
      description: 'Kebakaran & Penyelamatan',
      icon: <Flame className="w-8 h-8 text-white" />,
      bgColor: 'bg-orange-500 hover:bg-orange-600',
      shadowHover: 'hover:shadow-[0_10px_30px_rgba(249,115,22,0.4)]'
    },
    {
      title: 'Call Center',
      number: '112',
      description: 'Layanan Terpadu Bandung',
      icon: <Phone className="w-8 h-8 text-white" />,
      bgColor: 'bg-[#00C853] hover:bg-[#009e42]',
      shadowHover: 'hover:shadow-[0_10px_30px_rgba(0,200,83,0.4)]'
    }
  ];

  const address = settings?.address || 'Jl. Alun-Alun Timur, Balonggede, Kec. Regol, Kota Bandung, Jawa Barat 40251';
  const whatsappNumber = settings?.whatsapp_number || '628111111111';

  return (
    <main className="min-h-screen bg-[#f8fafc] flex-grow flex flex-col">
      
      {/* PREMIUM HERO BANNER */}
      <section className="relative w-full pt-24 md:pt-28 pb-24 md:pb-32 px-4 md:px-8 overflow-hidden bg-slate-900 flex items-center justify-center">
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-bandung-hijau/20 rounded-full blur-3xl"></div>
          <div className="absolute top-40 -left-20 w-72 h-72 bg-bandung-kuning/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-gradient-to-t from-slate-900 to-transparent"></div>
        </div>
        
        <div className="max-w-[1000px] mx-auto relative z-10 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-8">
            <span className="w-2 h-2 rounded-full bg-bandung-kuning animate-pulse"></span>
            <span className="text-white/90 font-label-caps text-xs tracking-widest uppercase">Layanan Informasi Wisatawan</span>
          </div>
          <h1 className="font-headline-lg text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-wider mb-6 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70 drop-shadow-sm leading-tight">
            Pusat Bantuan
          </h1>
          <p className="text-slate-300 font-body-lg text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-light">
            Kami siap memastikan kunjungan Anda di Kota Bandung berjalan aman, nyaman, dan penuh kenangan indah.
          </p>
        </div>
      </section>

      {/* PREMIUM EMERGENCY CARDS */}
      <section className="py-16 md:py-24 px-4 md:px-8 max-w-[1600px] mx-auto w-full -mt-20 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {emergencyContacts.map((contact, idx) => (
            <a 
              key={idx} 
              href={`tel:${contact.number}`}
              className={`group ${contact.bgColor} rounded-[2px] p-8 transition-all duration-300 transform hover:-translate-y-2 cursor-pointer shadow-lg ${contact.shadowHover}`}
            >
              <div className="flex justify-between items-start mb-6">
                <div className="p-4 rounded-full bg-white/20 group-hover:scale-110 transition-transform duration-300">
                  {contact.icon}
                </div>
                <ArrowUpRight className="w-5 h-5 text-white/50 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-white/80 font-label-caps text-xs tracking-widest uppercase mb-2">{contact.title}</h3>
              <p className="font-headline-lg text-4xl font-black mb-3 text-white">{contact.number}</p>
              <p className="text-white/90 font-body-sm text-sm border-t border-white/20 pt-4">{contact.description}</p>
            </a>
          ))}
        </div>
      </section>

      {/* TIC CONTACT INFO & WORKING MAP */}
      <section className="py-16 md:py-24 px-4 md:px-8 max-w-[1600px] mx-auto w-full">
        <div className="bg-white rounded-[2px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            
            {/* Left Content */}
            <div className="p-10 md:p-16 lg:p-20 flex flex-col justify-center">
              <span className="font-label-caps text-sm text-[#00C853] font-bold uppercase tracking-widest mb-4 block">Kunjungi Kami</span>
              <h2 className="font-headline-lg text-3xl md:text-5xl font-black text-slate-900 uppercase tracking-wider leading-[1.1] mb-6">
                Kantor<br/>Pelayanan TIC
              </h2>
              <p className="text-slate-600 font-body-md leading-relaxed mb-10 text-lg">
                Datang langsung ke kantor kami! Tim TIC dengan senang hati akan memberikan rekomendasi destinasi, peta wisata gratis, dan panduan acara terkini.
              </p>

              <div className="space-y-8 mb-12">
                <div className="flex items-start gap-5">
                  <div className="bg-slate-50 p-4 rounded-full border border-slate-100 shrink-0">
                    <MapPin className="w-6 h-6 text-[#00C853]" />
                  </div>
                  <div>
                    <h4 className="font-headline-sm text-lg font-bold text-slate-900 mb-1">Alamat Fisik</h4>
                    <p className="text-slate-600 font-body-md leading-relaxed whitespace-pre-line">{address}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-5">
                  <div className="bg-slate-50 p-4 rounded-full border border-slate-100 shrink-0">
                    <Clock className="w-6 h-6 text-[#00C853]" />
                  </div>
                  <div>
                    <h4 className="font-headline-sm text-lg font-bold text-slate-900 mb-1">Jam Operasional</h4>
                    <p className="text-slate-600 font-body-md leading-relaxed">
                      Setiap Hari: 08:00 - 16:00 WIB<br/>
                      <span className="text-sm text-slate-500">(Termasuk hari libur nasional)</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href={`https://wa.me/${whatsappNumber}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-3 bg-[#00C853] text-white px-8 py-4 font-bold rounded-[2px] shadow-lg shadow-electric-green hover:bg-[#009e42] hover:-translate-y-1 transition-all duration-300 font-label-caps tracking-widest text-sm"
                >
                  <MessageCircle className="w-5 h-5" />
                  Chat WhatsApp
                </a>
                <a 
                  href="https://www.google.com/maps?q=-6.9217848810924565,107.60756931267107" 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-3 bg-white text-slate-700 border-2 border-slate-200 px-8 py-4 font-bold rounded-[2px] hover:border-slate-300 hover:bg-slate-50 transition-all duration-300 font-label-caps tracking-widest text-sm"
                >
                  <MapPin className="w-5 h-5" />
                  Buka di Maps
                </a>
              </div>
            </div>

            {/* Right Content - Map */}
            <div className="relative h-[400px] lg:h-auto w-full bg-slate-100">
              <div className="absolute inset-0 z-0 transition-all duration-700">
                <DestinationMapWrapper latitude={-6.9217848810924565} longitude={107.60756931267107} name="Tourist Information Center" zoom={17} />
              </div>
              <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-black/10"></div>
            </div>

          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <FAQSection />

    </main>
  );
}
