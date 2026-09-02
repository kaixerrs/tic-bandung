import { createClient } from '@/utils/supabase/server';
import CategoryListingUI from '@/components/public/CategoryListingUI';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Pencarian' });
  return {
    title: t('metaTitle'),
    description: t('metaDesc'),
  };
}

export default async function PencarianPage({
  searchParams,
  params,

}: {
  searchParams: Promise<{ q?: string }>
}) {
  const resolvedParams = await searchParams;
  const q = resolvedParams.q || '';
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Pencarian');
  const tUI = await getTranslations('UI');
  const supabase = await createClient();

  let query = supabase
    .from('destinations')
    .select('*, images, categories!left(name, slug, cluster_color)')
    .eq('status', 'published');

  if (q) {
    query = query.ilike('name', `%${q}%`);
  }

  const { data: rawDestinations, error } = await query;

  if (error) {
    console.error("Search fetch error:", error);
  }

  // Format destinations for CategoryListingUI
  const formattedDestinations = (rawDestinations || []).map((dest: any) => ({
    id: dest.id,
    name: dest.name,
    slug: dest.slug,
    description: dest.description,
    district: dest.district,
    ticket_type: dest.ticket_type,
    ticket_nominal: dest.ticket_nominal,
    operating_hours: dest.operating_hours,
    destination_images: (dest.images || []).map((url: string) => ({ image_url: url }))
  }));

  const searchCategory = {
    id: 'search',
    name: q ? `Hasil Pencarian: "${q}"` : 'Semua Destinasi',
    slug: 'pencarian',
    description: `Menampilkan ${formattedDestinations.length} destinasi wisata yang sesuai dengan pencarian Anda.`,
    color_cluster: 'hijau'
  };

  return (
    <CategoryListingUI 
      category={searchCategory}
      initialDestinations={formattedDestinations}
    />
  );
}
