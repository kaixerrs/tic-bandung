import Link from 'next/link';
import { Search, MapPin, Mail, Phone, Globe, Camera, PlayCircle, MessageCircle } from 'lucide-react';
import Navbar from '@/components/public/Navbar';
import FooterWrapper from '@/components/public/FooterWrapper';
import { getSiteSettings } from '@/app/actions/cmsActions';

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. STICKY NAVBAR */}
      <Navbar />

      <div className="flex-grow flex flex-col">
        {children}
      </div>

      {/* 13. FOOTER */}
      <FooterWrapper>
      <footer className="bg-white border-t border-slate-200 w-full pt-16">
        <div className="w-full pb-12 px-6 md:px-12 lg:px-16 max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
            <img src="/logo/tictransparan.png" alt="TIC Kota Bandung" className="h-12 w-auto mb-4" />
            <p className="text-slate-600 text-base mb-6 leading-relaxed whitespace-pre-line">
              {settings?.description || 'Jelajahi keindahan, budaya, dan kuliner autentik di jantung Kota Bandung.'}
            </p>
            <div className="flex gap-4 text-slate-500">
              <Link className="hover:text-amber-700 transition-colors bg-slate-100 p-2 rounded-full" href={settings?.facebook_url || '#'}><Globe className="w-5 h-5" /></Link>
              <Link className="hover:text-amber-700 transition-colors bg-slate-100 p-2 rounded-full" href={settings?.instagram_url || '#'}><Camera className="w-5 h-5" /></Link>
              <Link className="hover:text-amber-700 transition-colors bg-slate-100 p-2 rounded-full" href={settings?.youtube_url || '#'}><PlayCircle className="w-5 h-5" /></Link>
            </div>
          </div>
          <div className="col-span-1 md:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8">
            <div className="flex flex-col gap-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-2">Eksplor</h4>
              <Link className="text-slate-600 hover:text-amber-700 transition-colors text-sm" href="/">Destinasi</Link>
              <Link className="text-slate-600 hover:text-amber-700 transition-colors text-sm" href="/kategori?cluster=kuliner">Kuliner</Link>
              <Link className="text-slate-600 hover:text-amber-700 transition-colors text-sm" href="/event">Event &amp; Festival</Link>
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-2">Layanan</h4>
              <Link className="text-slate-600 hover:text-amber-700 transition-colors text-sm" href="/trip-planner">Trip Planner</Link>
              <Link className="text-slate-600 hover:text-amber-700 transition-colors text-sm" href="/peta">Peta Interaktif</Link>
              <Link className="text-slate-600 hover:text-amber-700 transition-colors text-sm" href="#">Pusat Bantuan</Link>
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-2">Informasi</h4>
              <Link className="text-slate-600 hover:text-amber-700 transition-colors text-sm" href="#">Tentang Kami</Link>
              <Link className="text-slate-600 hover:text-amber-700 transition-colors text-sm" href="#">Kebijakan Privasi</Link>
              <Link className="text-slate-600 hover:text-amber-700 transition-colors text-sm" href="#">Syarat &amp; Ketentuan</Link>
            </div>
            <div className="flex flex-col gap-4 col-span-2 md:col-span-1">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-2">Kontak & Layanan</h4>
              <p className="text-slate-600 text-sm flex items-start gap-3">
                <MapPin className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
                <span className="whitespace-pre-line">
                  {settings?.address ? (
                    <><strong>Tourist Information Center (TIC)</strong><br/>{settings.address}</>
                  ) : (
                    <><strong>Tourist Information Center (TIC)</strong><br/>Jl. Asia Afrika No. 1<br/>Kota Bandung</>
                  )}
                </span>
              </p>
              <Link href={`https://wa.me/${settings?.whatsapp_number || '628111111111'}`} className="text-slate-600 text-sm flex items-center gap-3 hover:text-green-600 transition-colors">
                <Phone className="w-5 h-5 text-slate-400 shrink-0" />
                <span>WhatsApp: {settings?.whatsapp_number || '0811-111-1111'}</span>
              </Link>
              <div className="bg-red-50 p-4 rounded-xl border border-red-100 mt-2">
                <h5 className="text-xs font-bold text-red-800 uppercase tracking-wider mb-2">Nomor Darurat</h5>
                <p className="text-red-700 text-sm flex justify-between"><span>Polisi:</span> <strong>{settings?.emergency_police || '110'}</strong></p>
                <p className="text-red-700 text-sm flex justify-between"><span>Ambulans:</span> <strong>{settings?.emergency_ambulance || '119'}</strong></p>
                <p className="text-red-700 text-sm flex justify-between"><span>Pemadam:</span> <strong>{settings?.emergency_fire || '113'}</strong></p>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-200 py-6 text-center bg-slate-50">
          <p className="text-slate-500 text-sm">© {new Date().getFullYear()} Tourist Information Center (TIC) Kota Bandung. All Rights Reserved.</p>
        </div>
      </footer>
      </FooterWrapper>

      {/* Floating WhatsApp Button */}
      <a href={`https://wa.me/${settings?.whatsapp_number || '628111111111'}`} target="_blank" rel="noreferrer" className="fixed bottom-6 right-6 z-[9999] bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center group">
        <MessageCircle className="w-8 h-8" />
        <span className="absolute right-full mr-4 bg-white text-slate-800 text-sm font-bold py-2 px-4 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Chat TIC Bandung
        </span>
      </a>
    </div>
  );
}
