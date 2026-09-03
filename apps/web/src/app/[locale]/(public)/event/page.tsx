import { ModernHero } from '@/components/ui/ModernHero';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { CalendarDays } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Event' });
  return {
    title: t('metaTitle'),
    description: t('metaDesc'),
  };
}

export default async function EventPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Event');
  
  return (
    <main className="w-full bg-[#fcf9f5] min-h-screen overflow-x-hidden flex flex-col">
      <ModernHero 
        breadcrumbText={t('heroBreadcrumb')}
        title="KALENDER EVENT"
        highlightText=""
        highlightGradient="from-amber-600 to-amber-400"
        description="Daftar acara dan festival menarik di Kota Bandung"
      />
      
      <div className="flex-grow flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 max-w-xl w-full text-center flex flex-col items-center">
          <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mb-6">
            <CalendarDays className="w-10 h-10 text-amber-500" />
          </div>
          <h2 className="text-3xl font-display font-bold text-gray-900 mb-4 tracking-widest uppercase">
            Coming Soon
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Halaman daftar Kalender Event sedang dalam tahap pengembangan. 
            Nantikan fitur untuk melihat acara-acara seru yang akan datang di Kota Bandung!
          </p>
        </div>
      </div>
    </main>
  );
}
