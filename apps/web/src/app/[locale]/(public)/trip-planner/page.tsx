import TripPlannerUI from '@/components/public/TripPlannerUI';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'TripPlanner' });
  return { title: t('metaTitle'), description: t('metaDesc') };
}

export default async function Page({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('TripPlanner');
  return <TripPlannerUI />;
}
