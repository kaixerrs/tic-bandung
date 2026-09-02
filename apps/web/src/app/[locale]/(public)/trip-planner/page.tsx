import { getTranslations, setRequestLocale } from 'next-intl/server';
import TripPlannerUI from '@/components/public/TripPlannerUI';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'TripPlanner' });
  return { title: t('metaTitle'), description: t('metaDesc') };
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('TripPlanner');
  return <TripPlannerUI />;
}
