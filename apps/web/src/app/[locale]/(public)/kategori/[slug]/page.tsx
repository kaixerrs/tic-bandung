import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import CategoryListingUI from '@/components/public/CategoryListingUI';

// Reusable Next.js Metadata based on category
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const supabase = await createClient();
  
  const { data: category } = await supabase
    .from('categories')
    .select('name, description')
    .eq('slug', slug)
    .single();

  if (!category) return { title: 'Kategori Tidak Ditemukan' };

  return {
    title: `${category.name} | TIC Kota Bandung`,
    description: category.description || `Jelajahi destinasi ${category.name} di Kota Bandung.`,
  };
}

import EkonomiKreatifUI from '@/components/public/EkonomiKreatifUI';
import WalkingTourUI from '@/components/public/WalkingTourUI';

export const revalidate = 3600; // Cache for 1 hour

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const supabase = await createClient();

  // 1. Fetch category details
  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!category) {
    notFound();
  }

  // Handle Editorial/Walking Tour Exceptions (FR-20 & FR-21)
  if (slug === 'wisata-ekonomi-kreatif') {
    return <EkonomiKreatifUI />;
  }
  if (slug === 'walking-tour') {
    return <WalkingTourUI />;
  }

  // 2. Fetch all PUBLISHED destinations for this category
  // We use supabase relational query to get images
  const { data: rawDestinations, error } = await supabase
    .from('destinations')
    .select(`
      id, 
      name, 
      slug, 
      description, 
      address,
      price_info,
      opening_hours,
      images
    `)
    .eq('category_id', category.id)
    .eq('status', 'published');

  // Transform raw data to match CategoryListingUI interface
  let destinations: any[] = [];
  if (rawDestinations) {
    destinations = rawDestinations.map((d: any) => {
      let ticket_type = 'UNCONFIRMED';
      let ticket_nominal = null;
      if (d.price_info && typeof d.price_info === 'object') {
         ticket_type = d.price_info.type || 'UNCONFIRMED';
         ticket_nominal = d.price_info.nominal || null;
      }
      
      return {
        id: d.id,
        name: d.name,
        slug: d.slug,
        description: d.description,
        district: d.address || null, // Using address as district for filtering
        ticket_type: ticket_type,
        ticket_nominal: ticket_nominal,
        operating_hours: d.opening_hours ? JSON.stringify(d.opening_hours) : null,
        destination_images: d.images && Array.isArray(d.images) ? d.images.map((img: string) => ({ image_url: img })) : []
      };
    });
  }

  if (error) {
    console.error("Supabase Fetch Error:", error);
  }

  return (
    <CategoryListingUI 
      category={category} 
      initialDestinations={destinations || []} 
    />
  );
}
