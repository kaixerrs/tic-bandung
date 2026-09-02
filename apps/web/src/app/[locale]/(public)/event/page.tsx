import Link from 'next/link';
import { ModernHero } from '@/components/ui/ModernHero';
import { ChevronRight, CalendarDays, FileText, CheckCircle, Clock } from 'lucide-react';
import EventSubmissionForm from "@/components/public/EventSubmissionForm";
import { Montserrat } from 'next/font/google';
import { ScrollReveal } from '@/components/ui/animations/ScrollReveal';
import { getTranslations, setRequestLocale } from 'next-intl/server';

const montserrat = Montserrat({ subsets: ['latin'], weight: ['400', '700', '900'] });

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Event' });
  return {
    title: t('metaTitle'),
    description: t('metaDesc'),
  };
}

export default async function EventPage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Event');
  return (
    <main className="w-full bg-[#fcf9f5] min-h-screen overflow-x-hidden">
<ModernHero 
        breadcrumbText={t('heroBreadcrumb')}
        title={t('heroTitle')}
        highlightText={t('heroHighlight')}
        highlightGradient="from-amber-600 to-amber-400"
        description={t('heroDesc')}
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
                <h2 className={`${montserrat.className} text-3xl font-bold text-slate-900`}>{t('timelineTitle')}</h2>
              </div>
              
              <div className="relative border-l-2 border-amber-200 ml-6 space-y-8 pb-4">
                <div className="relative">
                  <div className="absolute -left-[35px] bg-amber-500 w-4 h-4 rounded-full border-4 border-white shadow"></div>
                  <div className="pl-6">
                    <span className="text-sm font-bold text-amber-600 block mb-1">{t('timeline1Date')}</span>
                    <h3 className="text-xl font-bold text-slate-800">{t('timeline1Title')}</h3>
                    <p className="text-slate-600 mt-2">{t('timeline1Desc')}</p>
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute -left-[35px] bg-slate-300 w-4 h-4 rounded-full border-4 border-white shadow"></div>
                  <div className="pl-6">
                    <span className="text-sm font-bold text-slate-500 block mb-1">{t('timeline2Date')}</span>
                    <h3 className="text-xl font-bold text-slate-800">{t('timeline2Title')}</h3>
                    <p className="text-slate-600 mt-2">{t('timeline2Desc')}</p>
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute -left-[35px] bg-slate-300 w-4 h-4 rounded-full border-4 border-white shadow"></div>
                  <div className="pl-6">
                    <span className="text-sm font-bold text-slate-500 block mb-1">{t('timeline3Date')}</span>
                    <h3 className="text-xl font-bold text-slate-800">{t('timeline3Title')}</h3>
                    <p className="text-slate-600 mt-2">{t('timeline3Desc')}</p>
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute -left-[35px] bg-slate-300 w-4 h-4 rounded-full border-4 border-white shadow"></div>
                  <div className="pl-6">
                    <span className="text-sm font-bold text-slate-500 block mb-1">{t('timeline4Date')}</span>
                    <h3 className="text-xl font-bold text-slate-800">{t('timeline4Title')}</h3>
                    <p className="text-slate-600 mt-2">{t('timeline4Desc')}</p>
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
                <h2 className={`${montserrat.className} text-3xl font-bold text-slate-900`}>{t('criteriaTitle')}</h2>
              </div>
              <ul className="space-y-4">
                <li className="flex gap-4">
                  <div className="w-6 h-6 shrink-0 mt-1"><CheckCircle className="w-5 h-5 text-emerald-600" /></div>
                  <p className="text-slate-700">{t.rich('criteria1', { strong: (chunks) => <strong>{chunks}</strong> })}</p>
                </li>
                <li className="flex gap-4">
                  <div className="w-6 h-6 shrink-0 mt-1"><CheckCircle className="w-5 h-5 text-emerald-600" /></div>
                  <p className="text-slate-700">{t('criteria2')}</p>
                </li>
                <li className="flex gap-4">
                  <div className="w-6 h-6 shrink-0 mt-1"><CheckCircle className="w-5 h-5 text-emerald-600" /></div>
                  <p className="text-slate-700">{t('criteria3')}</p>
                </li>
                <li className="flex gap-4">
                  <div className="w-6 h-6 shrink-0 mt-1"><CheckCircle className="w-5 h-5 text-emerald-600" /></div>
                  <p className="text-slate-700">{t.rich('criteria4', { strong: (chunks) => <strong>{chunks}</strong> })}</p>
                </li>
              </ul>
            </section>
            </div>
            </ScrollReveal>
          </div>
          {/* Bottom Row: Registration Form */}
          <div className="w-full">
            <div className="bg-[#1b1c1a] rounded-sm p-8  shadow-xl">
              <h3 className={`${montserrat.className} text-3xl font-bold text-white mb-2`}>{t('registerTitle')}</h3>
              <p className="text-slate-300 mb-8 text-sm leading-relaxed">{t('registerDesc')}</p>
              
              <EventSubmissionForm />
              
              <p className="text-slate-500 text-xs text-center mt-6">{t('registerTerms')}</p>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}




