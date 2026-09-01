import { createClient } from '@/utils/supabase/server';
import MapClientWrapper from '@/components/public/MapClientWrapper';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export const metadata = {
  title: 'Peta Interaktif Wisata | TIC Kota Bandung',
  description: 'Jelajahi seluruh destinasi wisata di Kota Bandung melalui peta interaktif.',
};

export default async function PetaPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const resolvedParams = await searchParams;
  const query = resolvedParams?.q ? resolvedParams.q.toLowerCase() : '';

  const supabase = await createClient();

  // Fetch all published destinations with coordinates
  let dbQuery = supabase
    .from('destinations')
    .select(`
      id, 
      name, 
      slug, 
      latitude, 
      longitude, 
      district,
      ticket_type,
      ticket_nominal,
      categories (
        name,
        color_cluster
      ),
      destination_images (
        image_url
      )
    `)
    .eq('status', 'published')
    .not('latitude', 'is', null)
    .not('longitude', 'is', null);

  if (query) {
    dbQuery = dbQuery.ilike('name', `%${query}%`);
  }

  const { data: destinations } = await dbQuery;

  // Map data to match MapClient props
  const formattedDestinations = (destinations || []).map(dest => ({
    id: dest.id,
    name: dest.name,
    slug: dest.slug,
    latitude: dest.latitude,
    longitude: dest.longitude,
    district: dest.district,
    ticket_type: dest.ticket_type,
    ticket_nominal: dest.ticket_nominal,
    category: {
      name: (dest.categories as any)?.name || 'Uncategorized',
      color_cluster: (dest.categories as any)?.color_cluster || 'default',
    },
    image_url: dest.destination_images?.[0]?.image_url || null,
  }));

  return (
    <main className="w-full h-[calc(100dvh-70px)] relative flex flex-col">
      {/* Floating Header */}
      <div className="absolute top-4 left-4 right-4 z-[1000] pointer-events-none flex justify-between items-start">
        <div className="pointer-events-auto flex flex-col gap-3">
          <Link href="/" className="bg-white/90 backdrop-blur-md hover:bg-white text-[#1b1c1a] px-4 py-2.5 rounded-full shadow-lg border border-white/20 font-bold text-sm flex items-center gap-2 transition-all w-max">
            <ChevronLeft className="w-4 h-4" />
            Kembali ke Beranda
          </Link>
          <button className="bg-amber-600/90 backdrop-blur-md hover:bg-amber-700 text-white px-4 py-2.5 rounded-full shadow-lg border border-amber-500/20 font-bold text-sm flex items-center gap-2 transition-all w-max">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
            Unduh Peta (PDF)
          </button>
        </div>
        

      </div>

      {/* The Map itself takes up the whole screen */}
      <div className="flex-1 w-full h-full z-0 relative">
        <MapClientWrapper destinations={formattedDestinations} />
      </div>
    </main>
  );
}
