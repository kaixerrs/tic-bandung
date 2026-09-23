import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { Montserrat } from 'next/font/google';

const montserrat = Montserrat({ subsets: ['latin'], weight: ['400', '700', '900'] });

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  
  return (
    <main className="w-full bg-[#f8f9fa] min-h-[70vh] pb-32">
      <div className="w-full max-w-[1000px] mx-auto px-6 md:px-12 pt-12 pb-4">
        <div className="flex items-center gap-2 text-sm text-slate-500 font-medium mb-8">
          <Link href={`/${locale}`} className="hover:text-blue-600 transition-colors">Beranda</Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-900 font-bold">Kebijakan Privasi</span>
        </div>
        
        <h1 className={`${montserrat.className} text-3xl md:text-5xl font-bold text-slate-900 mb-6`}>Kebijakan Privasi</h1>
        
        <div className="bg-white p-8 md:p-12 rounded-sm shadow-sm border border-slate-200">
          <p className="text-slate-600 leading-relaxed mb-6">
            Kebijakan privasi dan perlindungan data pengunjung.
          </p>
          <p className="text-slate-600 leading-relaxed italic">
            Halaman ini masih dalam tahap pengembangan. Konten lengkap akan segera ditambahkan.
          </p>
        </div>
      </div>
    </main>
  );
}
