import { Metadata } from 'next';
import { Phone, MapPin, Mail, AlertTriangle, MessageCircle, Clock, Globe } from 'lucide-react';
import FAQSection from '@/components/home/FAQSection';
import { getSiteSettings } from '@/app/actions/cmsActions';

export const metadata: Metadata = {
  title: 'Pusat Bantuan - TIC Kota Bandung',
  description: 'Informasi darurat, kontak resmi, dan FAQ Tourist Information Center Kota Bandung.',
};

export default async function PusatBantuanPage() {
  const settings = await getSiteSettings();

  const emergencyContacts = [
    {
      title: 'Polisi',
      number: settings?.emergency_police || '110',
      description: 'Layanan kepolisian darurat 24 jam.',
      color: 'bg-blue-500',
      hover: 'hover:bg-blue-600',
      icon: <Phone className="w-8 h-8 text-white" />
    },
    {
      title: 'Ambulans',
      number: settings?.emergency_ambulance || '119',
      description: 'Gawat darurat medis darurat.',
      color: 'bg-red-500',
      hover: 'hover:bg-red-600',
      icon: <Phone className="w-8 h-8 text-white" />
    },
    {
      title: 'Pemadam Kebakaran',
      number: settings?.emergency_fire || '113',
      description: 'Layanan pemadam kebakaran dan penyelamatan.',
      color: 'bg-orange-500',
      hover: 'hover:bg-orange-600',
      icon: <AlertTriangle className="w-8 h-8 text-white" />
    },
    {
      title: 'Call Center Bandung',
      number: '112',
      description: 'Pusat panggilan darurat terpadu Kota Bandung.',
      color: 'bg-teal-500',
      hover: 'hover:bg-teal-600',
      icon: <Phone className="w-8 h-8 text-white" />
    }
  ];

  const address = settings?.address || 'Jl. Alun-Alun Timur, Balonggede, Kec. Regol, Kota Bandung, Jawa Barat 40251';
  const whatsappNumber = settings?.whatsapp_number || '628111111111';

  return (
    <main className="min-h-screen bg-surface flex-grow flex flex-col pt-[72px] md:pt-[88px]">
      
      {/* HERO BANNER */}
      <section className="relative w-full bg-[#00C853] py-20 px-4 md:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-[1200px] mx-auto relative z-10 text-center">
          <span className="inline-block bg-white/20 px-4 py-2 rounded-[2px] text-white font-label-caps text-xs md:text-sm tracking-widest mb-6">LAYANAN WISATAWAN</span>
          <h1 className="font-headline-lg text-4xl md:text-6xl text-white font-black uppercase tracking-wider mb-6">Pusat Bantuan</h1>
          <p className="text-white/90 font-body-lg text-base md:text-xl max-w-2xl mx-auto leading-relaxed">
            Kami siap membantu menjadikan kunjungan Anda di Kota Bandung aman, nyaman, dan berkesan.
          </p>
        </div>
      </section>

      {/* EMERGENCY NUMBERS */}
      <section className="py-16 md:py-24 px-4 md:px-8 max-w-[1600px] mx-auto w-full">
        <div className="text-center mb-12">
          <h2 className="font-headline-lg text-3xl md:text-4xl font-black text-[#1A1A1A] uppercase tracking-wide mb-4">Kontak Darurat</h2>
          <p className="text-on-surface-variant font-body-md max-w-xl mx-auto">
            Gunakan nomor-nomor di bawah ini jika Anda mengalami situasi gawat darurat di Kota Bandung. Panggilan ini bebas pulsa.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {emergencyContacts.map((contact, idx) => (
            <a 
              key={idx} 
              href={`tel:${contact.number}`}
              className={`group flex flex-col p-8 rounded-[2px] shadow-lg transition-all duration-300 transform hover:-translate-y-2 cursor-pointer ${contact.color} ${contact.hover}`}
            >
              <div className="bg-white/20 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                {contact.icon}
              </div>
              <h3 className="text-white font-headline-sm text-2xl font-bold mb-2">{contact.title}</h3>
              <p className="text-white font-headline-lg text-4xl font-black mb-4">{contact.number}</p>
              <p className="text-white/90 font-body-sm text-sm">{contact.description}</p>
            </a>
          ))}
        </div>
      </section>

      {/* TIC CONTACT INFO */}
      <section className="py-16 md:py-24 px-4 md:px-8 bg-surface-container-low w-full border-y border-outline-variant/30">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          
          <div>
            <span className="font-label-caps text-[14px] md:text-[18px] text-[#00C853] font-bold uppercase tracking-widest mb-4 block">Kunjungi Kami</span>
            <h2 className="font-headline-lg text-3xl md:text-5xl font-black text-[#1A1A1A] uppercase tracking-wider leading-none mb-8">
              Kantor<br/>Pelayanan TIC
            </h2>
            <p className="text-on-surface-variant font-body-md leading-relaxed mb-8">
              Datang dan kunjungi kantor Tourist Information Center (TIC) Kota Bandung secara langsung. Tim kami dengan senang hati akan memberikan rekomendasi peta wisata, panduan acara, hingga suvenir gratis (selama persediaan masih ada).
            </p>

            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <div className="bg-[#00C853]/10 p-3 rounded-full shrink-0">
                  <MapPin className="w-6 h-6 text-[#00C853]" />
                </div>
                <div>
                  <h4 className="font-headline-sm font-bold text-[#1A1A1A] mb-1">Alamat Fisik</h4>
                  <p className="text-on-surface-variant font-body-sm leading-relaxed whitespace-pre-line">{address}</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="bg-[#00C853]/10 p-3 rounded-full shrink-0">
                  <Clock className="w-6 h-6 text-[#00C853]" />
                </div>
                <div>
                  <h4 className="font-headline-sm font-bold text-[#1A1A1A] mb-1">Jam Operasional</h4>
                  <p className="text-on-surface-variant font-body-sm leading-relaxed">
                    Setiap Hari: 08:00 - 16:00 WIB<br/>
                    (Termasuk hari libur nasional)
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="bg-[#00C853]/10 p-3 rounded-full shrink-0">
                  <Globe className="w-6 h-6 text-[#00C853]" />
                </div>
                <div>
                  <h4 className="font-headline-sm font-bold text-[#1A1A1A] mb-1">Media Sosial</h4>
                  <div className="flex gap-4 mt-2">
                    {settings?.instagram_url && <a href={settings.instagram_url} target="_blank" rel="noreferrer" className="text-on-surface-variant hover:text-[#00C853] font-label-caps text-xs tracking-wider">INSTAGRAM</a>}
                    {settings?.facebook_url && <a href={settings.facebook_url} target="_blank" rel="noreferrer" className="text-on-surface-variant hover:text-[#00C853] font-label-caps text-xs tracking-wider">FACEBOOK</a>}
                  </div>
                </div>
              </li>
            </ul>

            <div className="mt-10">
              <a 
                href={`https://wa.me/${whatsappNumber}`} 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-3 bg-[#00C853] text-white px-8 py-4 font-bold rounded-[2px] shadow-lg shadow-electric-green hover:bg-[#009e42] transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                Chat WhatsApp TIC Bandung
              </a>
            </div>
          </div>

          <div className="w-full h-[400px] md:h-[600px] bg-slate-200 rounded-[2px] overflow-hidden shadow-xl border border-white relative group">
            {/* Embedded Google Maps based on address coordinates roughly for Alun-Alun Bandung */}
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.751382583853!2d107.60533031535794!3d-6.920272094998248!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e62f9db5a1d7%3A0x6001007817ebbd31!2sTourist%20Information%20Center%20(TIC)%20Kota%20Bandung!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid" 
              width="100%" 
              height="100%" 
              style={{border:0}} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 grayscale group-hover:grayscale-0 transition-all duration-700"
            ></iframe>
          </div>

        </div>
      </section>

      {/* FAQ SECTION REUSED */}
      <FAQSection />

    </main>
  );
}
