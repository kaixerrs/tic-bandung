import Link from 'next/link';
import Image from 'next/image';
import { ModernHero } from '@/components/ui/ModernHero';
import { createClient } from '@/utils/supabase/server';
import { Image as ImageIcon } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Berita' });
  return {
    title: t('metaTitle'),
    description: t('metaDesc'),
  };
}

export default async function BeritaPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Berita');
  const supabase = await createClient();

  const { data: activeNews } = await supabase
    .from('news_articles')
    .select('*')
    .eq('status', 'published')
    .order('date_published', { ascending: false });

  return (
    <main className="w-full bg-[#fcf9f5] min-h-screen overflow-x-hidden">
      <ModernHero 
        breadcrumbText={t('metaTitle')}
        title={t('heroTitle')}
        highlightText={t('heroHighlight')}
        highlightGradient="from-green-600 to-green-400"
        description={t('heroDesc')}
      />

      <section className="py-6 md:py-12 px-4 md:px-8 lg:px-10 max-w-[1600px] mx-auto relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
          {activeNews && activeNews.length > 0 ? (
            activeNews.map((item, i) => (
              <Link key={item.id} href={`/berita/${item.slug || '#'}`} className="group cursor-pointer bg-white p-3 md:p-6 rounded-sm shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:shadow-electric-green transition-all duration-300 border border-gray-100 hover:-translate-y-2 flex flex-col h-full">
                <div className="relative w-full aspect-[4/3] overflow-hidden mb-3 md:mb-6 rounded-sm bg-surface-container-high shrink-0">
                  {item.image_url ? (
                    <Image fill sizes="(max-width: 768px) 100vw, 33vw" src={item.thumbnail_url || item.image_url} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105" alt={(locale === 'en' && item.title_en ? item.title_en : item.title)} />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center"><ImageIcon className="w-12 h-12 text-outline opacity-50" /></div>
                  )}
                </div>
                <div className="flex-1 flex flex-col">
                  <span className={`text-[#0050A2] font-label-caps text-[8px] md:text-[10px] uppercase tracking-widest mb-2 md:mb-4 inline-block bg-surface-container-low px-3 py-1 rounded-full w-fit`}>{item.category}</span>
                  <h3 className="font-headline-md text-sm md:text-xl lg:text-headline-md text-on-surface group-hover:text-[#00C853] transition-colors mb-2 md:mb-6 tracking-wide leading-tight line-clamp-3">{(locale === 'en' && item.title_en ? item.title_en : item.title)}</h3>
                </div>
                <div className="flex items-center text-on-surface-variant border-t border-outline-variant/30 pt-2 md:pt-4 shrink-0 mt-auto">
                  <span className="font-label-caps text-[9px] md:text-xs tracking-widest">
                    {new Date(item.date_published).toLocaleDateString(locale === 'en' ? 'en-US' : 'id-ID', {day: 'numeric', month: 'long', year: 'numeric'}).toUpperCase()}
                  </span>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-24 text-on-surface-variant">
              <h3 className="text-2xl font-bold mb-4">{t('noNews')}</h3>
              <p>{t('noNewsDesc')}</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}