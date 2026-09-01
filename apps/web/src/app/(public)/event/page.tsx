import Link from 'next/link';
import { ModernHero } from '@/components/ui/ModernHero';
import { ChevronRight, CalendarDays, FileText, CheckCircle, Clock } from 'lucide-react';
import EventSubmissionForm from "@/components/public/EventSubmissionForm";
import { Montserrat } from 'next/font/google';
import { ScrollReveal } from '@/components/ui/animations/ScrollReveal';

const montserrat = Montserrat({ subsets: ['latin'], weight: ['400', '700', '900'] });

export const metadata = {
  title: 'Calendar of Events (COE) | TIC Kota Bandung',
  description: 'Jadwal acara tahunan Kota Bandung dan pendaftaran event resmi.',
};

export default function EventPage() {
  return (
    <main className="w-full bg-[#fcf9f5] min-h-screen overflow-x-hidden">
<ModernHero 
        breadcrumbText="Calendar of Events"
        title="Calendar of Events"
        highlightText="(COE)"
        highlightGradient="from-amber-600 to-amber-400"
        description="Agenda tahunan yang mengkurasi acara-acara terbaik di Kota Bandung. Temukan ragam festival, pertunjukan seni, dan perayaan budaya sepanjang tahun."
      />
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 pb-24">

        <div className="flex flex-col gap-8">
          {/* Left Column: Info & Timeline */}
          <div className="w-full">
            <ScrollReveal>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Timeline Section */}
            <section className="bg-white rounded-sm p-8 border border-[#d3c5af]/50 shadow-sm">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-amber-700" />
                </div>
                <h2 className={`${montserrat.className} text-3xl font-bold text-slate-900`}>Timeline Kurasi CoE 2027</h2>
              </div>
              
              <div className="relative border-l-2 border-amber-200 ml-6 space-y-8 pb-4">
                <div className="relative">
                  <div className="absolute -left-[35px] bg-amber-500 w-4 h-4 rounded-full border-4 border-white shadow"></div>
                  <div className="pl-6">
                    <span className="text-sm font-bold text-amber-600 block mb-1">1 - 15 September 2026</span>
                    <h3 className="text-xl font-bold text-slate-800">Pendaftaran & Pengumpulan Berkas</h3>
                    <p className="text-slate-600 mt-2">Penyelenggara menyerahkan proposal dan dokumen pendukung.</p>
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute -left-[35px] bg-slate-300 w-4 h-4 rounded-full border-4 border-white shadow"></div>
                  <div className="pl-6">
                    <span className="text-sm font-bold text-slate-500 block mb-1">11 - 17 Oktober 2026</span>
                    <h3 className="text-xl font-bold text-slate-800">Tahap Kurasi CoE</h3>
                    <p className="text-slate-600 mt-2">Penilaian oleh dewan kurator profesional.</p>
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute -left-[35px] bg-slate-300 w-4 h-4 rounded-full border-4 border-white shadow"></div>
                  <div className="pl-6">
                    <span className="text-sm font-bold text-slate-500 block mb-1">18 - 31 Oktober 2026</span>
                    <h3 className="text-xl font-bold text-slate-800">Tahap Persiapan (Preparation)</h3>
                    <p className="text-slate-600 mt-2">Finalisasi konsep untuk event terpilih.</p>
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute -left-[35px] bg-slate-300 w-4 h-4 rounded-full border-4 border-white shadow"></div>
                  <div className="pl-6">
                    <span className="text-sm font-bold text-slate-500 block mb-1">November 2026</span>
                    <h3 className="text-xl font-bold text-slate-800">Launching Resmi</h3>
                    <p className="text-slate-600 mt-2">Pengumuman resmi sebelum kalender Disparbud dirilis.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Kriteria Section */}
            <section className="bg-white rounded-sm p-8 border border-[#d3c5af]/50 shadow-sm">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-emerald-700" />
                </div>
                <h2 className={`${montserrat.className} text-3xl font-bold text-slate-900`}>Kriteria & Ketentuan CoE</h2>
              </div>
              <ul className="space-y-4">
                <li className="flex gap-4">
                  <div className="w-6 h-6 shrink-0 mt-1"><CheckCircle className="w-5 h-5 text-emerald-600" /></div>
                  <p className="text-slate-700">Untuk event yang masuk <strong>Top 10</strong>, harus memiliki rekam jejak menyelenggarakan event-nya di Kota Bandung selama 3 tahun berturut-turut.</p>
                </li>
                <li className="flex gap-4">
                  <div className="w-6 h-6 shrink-0 mt-1"><CheckCircle className="w-5 h-5 text-emerald-600" /></div>
                  <p className="text-slate-700">Penyelenggara bersedia dan wajib melaporkan hasil event setelah kegiatan selesai.</p>
                </li>
                <li className="flex gap-4">
                  <div className="w-6 h-6 shrink-0 mt-1"><CheckCircle className="w-5 h-5 text-emerald-600" /></div>
                  <p className="text-slate-700">Wajib menyertakan rekam jejak media promosi event sebelumnya (Flyer, Logo, Foto, & Video kegiatan).</p>
                </li>
                <li className="flex gap-4">
                  <div className="w-6 h-6 shrink-0 mt-1"><CheckCircle className="w-5 h-5 text-emerald-600" /></div>
                  <p className="text-slate-700">Format isian formulir disesuaikan dengan standar <strong>KEN (Karisma Event Nusantara)</strong> dari Kemenparekraf.</p>
                </li>
              </ul>
            </section>
            </div>
            </ScrollReveal>
          </div>
          {/* Bottom Row: Registration Form */}
          <div className="w-full">
            <div className="bg-[#1b1c1a] rounded-sm p-8  shadow-xl">
              <h3 className={`${montserrat.className} text-3xl font-bold text-white mb-2`}>Daftarkan Event Anda</h3>
              <p className="text-slate-300 mb-8 text-sm leading-relaxed">Jadikan event Anda bagian dari daya tarik utama pariwisata Kota Bandung di tahun 2027.</p>
              
              <EventSubmissionForm />
              
              <p className="text-slate-500 text-xs text-center mt-6">Dengan mendaftar, Anda menyetujui syarat & ketentuan kurasi CoE Kota Bandung.</p>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}




